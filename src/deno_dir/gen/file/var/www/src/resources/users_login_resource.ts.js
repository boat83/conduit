import { bcrypt } from "../deps.ts";
import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import SessionModel from "../models/session_model.ts";
import ValidationService from "../services/validation_service.ts";
class LoginResource extends BaseResource {
    static paths = [
        "/api/users/login",
    ];
    async POST() {
        console.log("Handling LoginResource POST.");
        const action = this.request.getBodyParam("action");
        if (action == "check_if_user_is_authenticated") {
            return await this.checkIfUserIsAuthenticated();
        }
        return await this.logInUser();
    }
    async checkIfUserIsAuthenticated() {
        console.log("Checking if user has a session.");
        const sessionValues = this.request.getBodyParam("token");
        if (sessionValues) {
            const sessionValuesSplit = sessionValues.split("|::|");
            const sessionOne = sessionValuesSplit[0];
            const sessionTwo = sessionValuesSplit[1];
            if (sessionOne && sessionTwo) {
                const session = await SessionModel.getUserSession(sessionOne, sessionTwo);
                if (session) {
                    const user = await UserModel.where({ "id": session.user_id });
                    if (user.length > 0) {
                        const entity = user[0].toEntity();
                        entity.token = `${session.session_one}|::|${session.session_two}`;
                        this.response.body = {
                            user: entity,
                        };
                        console.log("User has an active session.");
                        return this.response;
                    }
                }
            }
        }
        console.log("User's session is invalid or has expired.");
        this.response.status_code = 401;
        this.response.body = {
            errors: {
                body: ["Invalid session."],
            },
        };
        return this.response;
    }
    async logInUser() {
        const inputUser = this.request.getBodyParam("user");
        if (!inputUser.email) {
            return this.errorResponse(422, "Email field required.");
        }
        if (!ValidationService.isEmail(inputUser.email)) {
            return this.errorResponse(422, "Email must be a valid email.");
        }
        const result = await UserModel.where({ email: inputUser.email });
        if (result.length <= 0) {
            console.log("User not found.");
            return this.errorResponse(422, "Invalid user credentials.");
        }
        const user = result[0];
        const rawPassword = inputUser.password ? inputUser.password : "";
        if (!rawPassword) {
            return this.errorResponse(422, "Password field required.");
        }
        if (!(await ValidationService.isPasswordCorrect(rawPassword, user.password))) {
            console.log("Passwords do not match.");
            return this.errorResponse(422, "Invalid user credentials.");
        }
        const sessionOne = await bcrypt.hash("sessionOne2020Drash");
        const sessionTwo = await bcrypt.hash("sessionTwo2020Drash");
        const Session = new SessionModel(sessionOne, sessionTwo, user.id);
        const session = await Session.save();
        if (!session) {
            return this.errorResponse(422, "An error occurred whilst saving your session");
        }
        const entity = user.toEntity();
        entity.token = `${session.session_one}|::|${session.session_two}`;
        this.response.body = {
            user: entity,
        };
        return this.response;
    }
}
export default LoginResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnNfbG9naW5fcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Vyc19sb2dpbl9yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFTLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sU0FBeUIsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLFlBQVksTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLGlCQUFpQixNQUFNLG1DQUFtQyxDQUFDO0FBRWxFLE1BQU0sYUFBYyxTQUFRLFlBQVk7SUFDdEMsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLGtCQUFrQjtLQUNuQixDQUFDO0lBNEJLLEtBQUssQ0FBQyxJQUFJO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELElBQUksTUFBTSxJQUFJLGdDQUFnQyxFQUFFO1lBQzlDLE9BQU8sTUFBTSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztTQUNoRDtRQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQVdTLEtBQUssQ0FBQywwQkFBMEI7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBWSxDQUFDO1FBQ3JFLElBQUksYUFBYSxFQUFFO1lBQ2pCLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxN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