import prisma from "../config/prisma.js";

// Create a new inquiry
export const createInquiry = async (data: {
    customerName: string;
    contact: string;
    subject: string;
    description: string;
    createdById: string;
}) => {
    return await prisma.inquiry.create({
        data: {
            customerName: data.customerName,
            contact: data.contact,
            subject: data.subject,
            description: data.description,
            createdById: data.createdById
        }
    });
};

// Get all inquiries
export const getAllInquiries = async (filters: {
    search?: string;
    status?: "NEW" | "IN_PROGRESS" | "RESOLVED";
}) => {
    return await prisma.inquiry.findMany({
        where: {
            ...(filters.status && {
                status: filters.status
            }),

            ...(filters.search && {
                OR: [
                    {
                        customerName: {
                            contains: filters.search,
                            mode: "insensitive"
                        }
                    },
                    {
                        subject: {
                            contains: filters.search,
                            mode: "insensitive"
                        }
                    }
                ]
            })
        },

        orderBy: {
            createdAt: "desc"
        }
    });
};

// Get one inquiry
export const getInquiryById = async (id: string) => {
    return await prisma.inquiry.findUnique({
        where: {
            id: id
        }
    });
};

export const updateInquiryStatus = async (
    id: string,
    status: "NEW" | "IN_PROGRESS" | "RESOLVED"
) => {
    const inquiry = await prisma.inquiry.findUnique({
        where: { id }
    });

    if (!inquiry) {
        return { error: "NOT_FOUND" };
    }

    const allowedTransitions: Record<string, string[]> = {
        NEW: ["IN_PROGRESS"],
        IN_PROGRESS: ["RESOLVED"],
        RESOLVED: ["IN_PROGRESS"]
    };

    if (!allowedTransitions[inquiry.status].includes(status)) {
        return { error: "INVALID_TRANSITION" };
    }

    const updatedInquiry = await prisma.inquiry.update({
        where: { id },
        data: { status }
    });

    return { inquiry: updatedInquiry };
};
