import { NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { main } from "../route";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import { Pirata_One } from "next/font/google";

export const GET = async (req: Request) => {
    try {
        const id = req.url.split('/blog/')[1]

        if (!id) {
            return NextResponse.json({message: "Invalid Id"}, {status: 400})
        }

        await main()

        const post = await prisma.post.findUnique({
            where: {id}
        })

        if (!post) {
            return NextResponse.json({message: "Post not found"}, {status: 404})
        }

        return NextResponse.json({message: "Success", post}, {status: 200})


    } catch (error) {
        return NextResponse.json({message: "Error in blog route"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}

export const PUT = async(req: Request) => {
    try {   
        const id = new URL(req.url).pathname.split("/blog/")[1]

        const formData = await req.formData()

        if (!id) {
            return NextResponse.json({message: "Invalid id"}, {status: 400})
        }

        const existingPost = await prisma.post.findUnique({
            where: {id}
        })

        if (!existingPost) {
            return NextResponse.json({message: "Post not found"},{status: 404})
        }

        const title = formData.get("title") as string
        const description = formData.get('description') as string
        const category = formData.get("category") as string
        const newImage = formData.get("image") as File | null

        if (! title || !description || category) {
            return NextResponse.json({message: "All fields are required"}, {status: 400})
        }

        // CHECK IMAGE
        const updateData: any = {
            title,
            description,
            category
        }

        if (newImage) {
            if(existingPost.imageUrl) {
                try {
                    const oldImagePath = existingPost.imageUrl.split("/uploads/")[1]
                    await unlink(path.join(process.cwd(), "public", "uploads", oldImagePath))
                } catch (error) {
                    throw new Error("Erro in updating image")
                }
            }
            const buffer = Buffer.from(await newImage.arrayBuffer())
            const fileName = `${Date.now()}-${newImage}`
            const imagePath = path.join(process.cwd(), "public", "uploads", fileName)

            await writeFile(imagePath, buffer)
            updateData.imageUrl =`/uploads/${fileName}`
        }

        await main()
        const post = await prisma.post.update({
            where: {id},
            data: updateData
        })

        return NextResponse.json({message: "Post updated", post}, {status: 200})


    } catch (error) {
        return NextResponse.json({message: "Error in blog route"},{status: 500})
    } finally {
        await prisma.$disconnect()
    }
}

export const DELETE = async(req: Request) => {
    try {
        const id = req.url.split("/blog/")[1]

        if (!id) {
             return NextResponse.json({message: "Invcalid Id"}, {status: 400})
        }

        await main()

        const post = await prisma.post.findUnique({
            where: {id}
        })

        if (!post) {
            return NextResponse.json({message: "Post not found"}, {status: 404})
        }

        if (post.imageUrl) {
            try {
                const imagePath = post.imageUrl.split("/uploads/")[1]

                if (imagePath) {
                    await unlink(path.join(process.cwd(), "public", "uploads", imagePath))
                }
                await prisma.post.delete({where: {id}})

            } catch (error) {
                return NextResponse.json({message: "Error in deleting image"})
            }
        }

    } catch (error) {
        return NextResponse.json({message: "Error in blog route"}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}