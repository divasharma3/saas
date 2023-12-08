import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/send-message-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { prompt } = body;

    const { getUser } = getKindeServerSession();
    const user = getUser();

    const { id: userId } = user;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await replicate.run(
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      {
        input: {
          prompt: prompt,
        },
      }
    );

    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    });

    await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  })

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MESSAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
