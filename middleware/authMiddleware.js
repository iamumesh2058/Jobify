import { 
    UnauthenticatedError, 
    UnauthorizedError ,
    BadRequestError
} from "../errors/customError.js";
import { verifyJWT } from "../utils/token.utils.js";

export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) throw new UnauthenticatedError("Authentication invalid");
    try {
        const {userId, role } = verifyJWT(token);
        const testUser = userId === "65f2db4456f893f67cdc1502";
        req.user = { userId, role, testUser };
        next();
    }
    catch (error){
        if (!token) throw new UnauthenticatedError("Authentication invalid");
    }
};


export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            console.log(here);
            throw new UnauthorizedError('Unauthorized to acess this route')
        }
        next();
    }
}


export const checkForTestUser = (req, res, next) => {
    if(req.user.testUser) throw new BadRequestError("Demo User. Read Only!");
    next();
}