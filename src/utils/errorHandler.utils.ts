import { Request, Response } from "express"

export default function handle(func : (req: Request, res: Response) => Promise<any>){
    return async (req: Request, res: Response) => {
        try {
            await func(req, res);
        } catch (e) {
            // if(verbose) console.error(`Error while processing request (${req.originalUrl}):`, e);
            /* else */console.error(`Error while processing request (${req.originalUrl}): ${e}`);
            if(!res.headersSent){
                res.status(500).json({code: 'INTERNAL', message: 'Что-то пошло не так, повторите попытку позже'})
            }
        }
    }
}