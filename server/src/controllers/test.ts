// test controller that returns a simple message
import {Request, Response} from 'express';

export const testController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Return a simple message with user details
        res.status(200).json({
            message: 'Test successful',
        });
    } catch (error) {
        console.error('Error in testController:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};