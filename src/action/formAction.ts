'use server'


// Define your server action
export default async function createFundraiser(formData: FormData) {

    try {
        // Get all form values
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const goalAmount = formData.get("goalAmount") as string;
        const category = formData.get("category") as string;
        const walletAddress = formData.get("walletAddress") as string;

        // Image handling would need to be done differently with FormData
        // For now, just log what we received
        console.log({
            title,
            description,
            goalAmount: Number(goalAmount),
            category: category.toLowerCase(),
            walletAddress,
        });

        // Your API request would go here
        // const response = await apiRequest("POST", "/fundraise/create", payload);

        // Return success for now
        return { success: true, message: "Fundraiser created successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}