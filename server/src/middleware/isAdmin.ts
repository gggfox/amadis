import { User } from "../entities/User";
import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAdmin: MiddlewareFn<MyContext> = ({context}, next) => {
    
    if(!context.req.session.userId){
        throw new Error("not authenticated");
    }
    const isAdmin = async() => {
        const user = await User.findOne(context.req.session.userId);
        console.log(user);
        if(user?.userType === "admin"){
            return true;
        }
        return false;
    }
    
    if(!isAdmin){
        throw new Error("user is not admin");
    }else{
    return next();
    }
}