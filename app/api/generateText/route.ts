import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.messages || !Array.isArray(data.messages)) {
      return NextResponse.json({ error: "Invalid 'messages' field in request body" }, { status: 400 });
    }

    const modelResponse = [];

    for await (const chunk of inference.chatCompletionStream({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: data.messages,
      max_tokens: 500,
    })) {
      modelResponse.push(chunk.choices[0]?.delta?.content || "");
    }

    return NextResponse.json({ content: modelResponse.join('') });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
