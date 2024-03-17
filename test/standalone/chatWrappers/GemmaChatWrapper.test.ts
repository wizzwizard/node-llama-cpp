import {describe, expect, test} from "vitest";
import {ChatHistoryItem, GemmaChatWrapper} from "../../../src/index.js";
import {defaultChatSystemPrompt} from "../../../src/config.js";


describe("GemmaChatWrapper", () => {
    const conversationHistory: ChatHistoryItem[] = [{
        type: "system",
        text: defaultChatSystemPrompt
    }, {
        type: "user",
        text: "Hi there!"
    }, {
        type: "model",
        response: ["Hello!"]
    }];
    const conversationHistory2: ChatHistoryItem[] = [{
        type: "system",
        text: defaultChatSystemPrompt
    }, {
        type: "user",
        text: "Hi there!"
    }, {
        type: "model",
        response: ["Hello!"]
    }, {
        type: "user",
        text: "How are you?"
    }, {
        type: "model",
        response: ["I'm good, how are you?"]
    }];

    test("should generate valid context text", () => {
        const chatWrapper = new GemmaChatWrapper();
        const {contextText} = chatWrapper.generateContextText(conversationHistory);

        expect(contextText.values).toMatchInlineSnapshot(`
          [
            {
              "type": "specialToken",
              "value": "<start_of_turn>user
          ",
            },
            "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.
          If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.

          ---

          Hi there!",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>model
          ",
            },
            "Hello!",
          ]
        `);

        const {contextText: contextText2} = chatWrapper.generateContextText(conversationHistory2);

        expect(contextText2.values).toMatchInlineSnapshot(`
          [
            {
              "type": "specialToken",
              "value": "<start_of_turn>user
          ",
            },
            "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.
          If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.

          ---

          Hi there!",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>model
          ",
            },
            "Hello!",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>user
          ",
            },
            "How are you?",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>model
          ",
            },
            "I'm good, how are you?",
          ]
        `);

        const {contextText: contextText3} = chatWrapper.generateContextText(conversationHistory);
        const {contextText: contextText3WithOpenModelResponse} = chatWrapper.generateContextText([
            ...conversationHistory,
            {
                type: "model",
                response: []
            }
        ]);

        expect(contextText3.values).toMatchInlineSnapshot(`
          [
            {
              "type": "specialToken",
              "value": "<start_of_turn>user
          ",
            },
            "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.
          If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.

          ---

          Hi there!",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>model
          ",
            },
            "Hello!",
          ]
        `);

        expect(contextText3WithOpenModelResponse.values).toMatchInlineSnapshot(`
          [
            {
              "type": "specialToken",
              "value": "<start_of_turn>user
          ",
            },
            "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.
          If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.

          ---

          Hi there!",
            {
              "type": "specialToken",
              "value": "<end_of_turn>
          ",
            },
            {
              "type": "specialToken",
              "value": "<start_of_turn>model
          ",
            },
            "Hello!

          ",
          ]
        `);
    });
});