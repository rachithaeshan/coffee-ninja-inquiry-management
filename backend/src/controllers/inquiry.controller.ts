
import { Request, Response } from "express";

import {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiryStatus
} from "../services/inquiry.service.js";

// Check whether an ID is a valid UUID
const isValidUUID = (id: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Create inquiry
export const createInquiryController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            customerName,
            contact,
            subject,
            description
        } = req.body;

        if (
            typeof customerName !== "string" ||
            typeof contact !== "string" ||
            typeof subject !== "string" ||
            typeof description !== "string" ||
            !customerName.trim() ||
            !contact.trim() ||
            !subject.trim() ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All customer information fields are required."
            });
        }

        // Get employee ID from verified JWT token
        const createdById = req.userId;

        if (!createdById) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const inquiry = await createInquiry({
            customerName: customerName.trim(),
            contact: contact.trim(),
            subject: subject.trim(),
            description: description.trim(),
            createdById
        });

        return res.status(201).json({
            success: true,
            message: "Inquiry created successfully.",
            data: inquiry
        });

    } catch (error) {
        console.error("Create inquiry error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create inquiry."
        });
    }
};

// Get all inquiries with search and filtering
export const getAllInquiriesController = async (
    req: Request,
    res: Response
) => {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : undefined;

        const status =
            typeof req.query.status === "string"
                ? req.query.status.toUpperCase()
                : undefined;

        const validStatuses = [
            "NEW",
            "IN_PROGRESS",
            "RESOLVED"
        ];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status filter."
            });
        }

        const inquiries = await getAllInquiries({
            search,
            status: status as
                | "NEW"
                | "IN_PROGRESS"
                | "RESOLVED"
                | undefined
        });

        return res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });

    } catch (error) {
        console.error("Get inquiries error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve inquiries."
        });
    }
};

// Get one inquiry
export const getInquiryByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        // First, validate the ID
        if (typeof id !== "string" || !isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID."
            });
        }

        // Then, search for the inquiry
        const inquiry = await getInquiryById(id);

        // Check whether the inquiry exists
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: inquiry
        });

    } catch (error) {
        console.error("Get inquiry error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve inquiry."
        });
    }
};

// Update inquiry status
export const updateInquiryStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const validStatuses = [
            "NEW",
            "IN_PROGRESS",
            "RESOLVED"
        ];

        if (
            typeof status !== "string" ||
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });
        }

        // Validate inquiry ID
        if (typeof id !== "string" || !isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID."
            });
        }

        const result = await updateInquiryStatus(
            id,
            status as "NEW" | "IN_PROGRESS" | "RESOLVED"
        );

        if (result.error === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found."
            });
        }

        if (result.error === "INVALID_TRANSITION") {
            return res.status(400).json({
                success: false,
                message: "This status transition is not allowed."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inquiry status updated successfully.",
            data: result.inquiry
        });

    } catch (error) {
        console.error("Update inquiry status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update inquiry status."
        });
    }
};
