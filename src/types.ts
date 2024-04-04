import {GbnfJsonSchema, GbnfJsonSchemaToType} from "./utils/gbnfJson/types.js";
import {BuiltinSpecialTokenValue} from "./utils/LlamaText.js";

export type Token = number & {
    __token: never
};

export type Tokenizer = {
    tokenize(text: string, specialTokens?: boolean, options?: "trimLeadingSpace"): Token[],
    tokenize(text: BuiltinSpecialTokenValue, specialTokens: "builtin"): Token[]
}["tokenize"];


export type ChatHistoryItem = ChatSystemMessage | ChatUserMessage | ChatModelResponse;

export type ChatSystemMessage = {
    type: "system",
    text: string
};
export type ChatUserMessage = {
    type: "user",
    text: string
};
export type ChatModelResponse = {
    type: "model",
    response: (string | ChatModelFunctionCall)[]
};
export type ChatModelFunctionCall = {
    type: "functionCall",
    name: string,
    description?: string,
    params: any,
    result: any,
    raw?: string
};

export type ChatModelFunctions = {
    readonly [name: string]: {
        readonly description?: string,
        readonly params?: GbnfJsonSchema | undefined | null
    }
};

export type ChatSessionModelFunctions = {
    readonly [name: string]: ChatSessionModelFunction<any>
};

export type ChatSessionModelFunction<Params extends GbnfJsonSchema | undefined = GbnfJsonSchema | undefined> = {
    readonly description?: string,
    readonly params?: Params,
    readonly handler: (params: GbnfJsonSchemaToType<Params>) => any
};

export function isChatModelResponseFunctionCall(item: ChatModelResponse["response"][number]): item is ChatModelFunctionCall {
    if (typeof item === "string")
        return false;

    return item.type === "functionCall";
}

export type LLamaContextualRepeatPenalty = {
    /**
     * Number of recent tokens generated by the model to apply penalties to repetition of.
     * Defaults to `64`.
     */
    lastTokens?: number,

    punishTokensFilter?: (tokens: Token[]) => Token[],

    /**
     * Penalize new line tokens.
     * Enabled by default.
     */
    penalizeNewLine?: boolean,

    /**
     * The relative amount to lower the probability of the tokens in `punishTokens` by
     * Defaults to `1.1`.
     * Set to `1` to disable.
     */
    penalty?: number,

    /**
     * For n time a token is in the `punishTokens` array, lower its probability by `n * frequencyPenalty`
     * Disabled by default (`0`).
     * Set to a value between `0` and `1` to enable.
     */
    frequencyPenalty?: number,

    /**
     * Lower the probability of all the tokens in the `punishTokens` array by `presencePenalty`
     * Disabled by default (`0`).
     * Set to a value between `0` and `1` to enable.
     */
    presencePenalty?: number
};
