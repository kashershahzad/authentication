import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// SENDING DATA TO DATABASE

export async function POST(req) {
    try {
        const body = await req.json();

        const newCustomer = await prisma.customer.create({
            data: {
                name: body?.name,
                price: body?.billPrice,
                status: body?.status
            },
        });

        return new Response(JSON.stringify({ message: "Successfully created", id: newCustomer.id }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            message: "Something went wrong",
            error: error.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}




// GETTING DATA


export async function GET() {
    try {
        const data = await prisma.customer.findMany();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: "Something went wrong",
            error: error.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}







// DELETING DATA FROM DATABASE

export async function DELETE(req) {
  try {
    const { id } = await req.json(); 
    await prisma.customer.delete({
      where: { id },
    });
    return new Response(JSON.stringify({ message: "Customer Deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", error: error.message }),
      { status: 500 }
    );
  }
}





// UPDATING DATA FROM DATA BASE


export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, billPrice, status } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Customer ID is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: {
                name: name || undefined,  
                price: billPrice || undefined,
                status: status || undefined,
            },
        });

        return new Response(
            JSON.stringify({ message: "Customer updated successfully", updatedCustomer }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Something went wrong",
                error: error.message
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
