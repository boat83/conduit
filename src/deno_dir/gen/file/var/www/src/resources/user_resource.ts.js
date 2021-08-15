import { bcrypt } from "../deps.ts";
import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import ValidationService from "../services/validation_service.ts";
export default class UserResource extends BaseResource {
    static paths = [
        "/api/user",
        "/api/user/:username",
    ];
    async GET() {
        this.response.body = await UserModel.where({
            username: this.request.getPathParam("username") || "",
        });
        if (!this.response.body) {
            return this.errorResponse(400, "Username must exist in the uri");
        }
        return this.response;
    }
    async POST() {
        console.log("Handling UserResource POST.");
        const id = this.request.getBodyParam("id") || "";
        const username = ValidationService.decodeInput(this.request.getBodyParam("username") || "");
        const email = ValidationService.decodeInput(this.request.getBodyParam("email") || "");
        const rawPassword = ValidationService.decodeInput(this.request.getBodyParam("password") || "");
        const bio = ValidationService.decodeInput(this.request.getBodyParam("bio") || "");
        const image = ValidationService.decodeInput(this.request.getBodyParam("image") || "");
        const token = this.request.getBodyParam("token") || "";
        const result = await UserModel.where({ id: id });
        if (result.length <= 0) {
            console.log("User not found.");
            return this.errorResponse(404, "Error updating your profile.");
        }
        const user = result[0];
        console.log("Validating inputs.");
        if (!username) {
            return this.errorResponse(422, "Username field required.");
        }
        if (!image) {
            return this.errorResponse(422, "Image field required.");
        }
        if (!email) {
            return this.errorResponse(422, "Email field required.");
        }
        if (!ValidationService.isEmail(email)) {
            return this.errorResponse(422, "Email must be a valid email.");
        }
        if (email != user.email) {
            if (!(await ValidationService.isEmailUnique(email))) {
                return this.errorResponse(422, "Email already taken.");
            }
        }
        if (rawPassword) {
            if (!ValidationService.isPasswordStrong(rawPassword)) {
                return this.errorResponse(422, "Password must be 8 characters long and include 1 number, 1 " +
                    "uppercase letter, and 1 lowercase letter.");
            }
        }
        user.username = username;
        user.bio = bio ?? "";
        user.image = image;
        if (rawPassword) {
            user.password = await bcrypt.hash(rawPassword);
        }
        const savedUser = await user.save();
        if (savedUser === null) {
            return this.errorResponse(422, "An error occurred whilst saving your user");
        }
        const entity = savedUser.toEntity();
        entity.token = token;
        this.response.body = {
            user: entity,
        };
        return this.response;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXJfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLFNBQVMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLGlCQUFpQixNQUFNLG1DQUFtQyxDQUFDO0FBRWxFLE1BQU0sQ0FBQyxPQUFPLE9BQU8sWUFBYSxTQUFRLFlBQVk7SUFDcEQsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLFdBQVc7UUFDWCxxQkFBcUI7S0FDdEIsQ0FBQztJQVNLLEtBQUssQ0FBQyxHQUFHO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ3pDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO1NBQ3RELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQ3ZCLEdBQUcsRUFDSCxnQ0FBZ0MsQ0FDakMsQ0FBQztTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFtQk0sS0FBSyxDQUFDLElBQUk7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFHM0MsTUFBTSxFQUFFLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFxQixJQUFJLEVBQUUsQ0FBQztRQUN0RSxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBWSxJQUFJLEVBQUUsQ0FD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