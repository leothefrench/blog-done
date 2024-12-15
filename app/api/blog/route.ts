import { prisma } from "@/services/db"
import { NextResponse } from "next/server"
import path from "path"
import fs, { stat } from "fs"
import { randomUUID } from "crypto"

export async function main() {
    try {
        await prisma.$connect()
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const GET =  async() => {
    try {
        await main()
        const posts = await prisma.post.findMany()
        return NextResponse.json({message: "Success", posts}, {status: 200})
    } catch (error) {
        return NextResponse.json({ message: `${error}`}, { status: 500})
    } finally {
        await prisma.$disconnect()
    }
}

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const category = formData.get('category') as string
        const image = formData.get('image') as File | null

        if( !title || !description || !category) {
            return NextResponse.json({message: "All fileds are required"}, { status: 400})
        }

        let imageUrl: string | null = null

        if (image) {
            try {
                const buffer = Buffer.from(await image.arrayBuffer())

                const fileName = `${randomUUID()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
                const uploadDir = path.join(process.cwd(), 'public', 'uploads')
                const imagePath = path.join(uploadDir, fileName)

                await fs.promises.writeFile(imagePath, buffer)
                imageUrl =`/uploads/${fileName}`

            } catch (error) {
                imageUrl = null
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                description,
                category,
                imageUrl
            }
        })

        return NextResponse.json({message: "Post created successfully", post}, {status:201})

    } catch (error) {
        return NextResponse.json({ message: `${error}`}, { status: 500})
    } finally {
        await prisma.$disconnect()
    }
}