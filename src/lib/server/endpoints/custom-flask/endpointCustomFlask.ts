import { buildPrompt } from "$lib/buildPrompt";
import type { TextGenerationStreamOutput } from "@huggingface/inference";
import type { Endpoint } from "../endpoints";
import { z } from "zod";

export const endpointCustomFlaskParametersSchema = z.object({
    weight: z.number().int().positive().default(1),
    model: z.any(),
    type: z.literal("custom-flask"),
    url: z.string().url(),
    stopUrl: z.string().url(),
});

export function endpointCustomFlask(input: z.input<typeof endpointCustomFlaskParametersSchema>): Endpoint {
    const { url, model } = endpointCustomFlaskParametersSchema.parse(input);

    return async ({ messages, preprompt, continueMessage, generateSettings }) => {
        const prompt = await buildPrompt({
            messages,
            continueMessage,
            preprompt,
            model,
        });

        const parameters = { ...model.parameters, ...generateSettings };

        // Start the long-running task
        const startResponse = await fetch(`${url}/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                model: model.name,
                raw: true,
                options: {
                    top_p: parameters.top_p,
                    top_k: parameters.top_k,
                    temperature: parameters.temperature,
                    repeat_penalty: parameters.repetition_penalty,
                    stop: parameters.stop,
                    num_predict: parameters.max_new_tokens,
                },
            }),
        });

        if (!startResponse.ok) {
            throw new Error(`Failed to start generation: ${await startResponse.text()}`);
        }

        const startData = await startResponse.json();
        const taskId = startData.task_id;

        // Polling function
        async function pollResult(taskId) {
            const pollResponse = await fetch(`${url}/result/${taskId}`);
            const pollData = await pollResponse.json();

            if (pollData.state === 'PENDING') {
                // Continue polling
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        resolve(await pollResult(taskId));
                    }, 1000); // Poll every 5 seconds
                });
            } else {
                // Task is complete, return the result
                return pollData.result;
            }
        }

        // Wait for the task to complete
        const result = await pollResult(taskId);
        const responseText = result.generated_text.join(' ');

        return [{
            token: {
                id: 0,
                text: responseText,
                logprob: 0,
                special: false,
            },
            generated_text: responseText,
            details: null,
        }]
    };
}

export default endpointCustomFlask;