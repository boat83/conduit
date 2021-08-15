import { Drash } from "../deps.ts";
import UserModel from "../models/user_model.ts";
class BaseResource extends Drash.Http.Resource {
    current_user = null;
    errorResponse(statusCode, message) {
        this.response.status_code = statusCode;
        this.response.body = {
            errors: {
                body: [message],
            },
        };
        return this.response;
    }
    errorResponseCurrentUser() {
        return this.errorResponse(400, "`user_id` field is required.");
    }
    async getCurrentUser() {
        console.log("Getting the current user.");
        if (this.current_user) {
            console.log(`Using cached User #${this.current_user.id}.`);
            return this.current_user;
        }
        const userId = this.request.getUrlQueryParam("user_id") ||
            this.request.getBodyParam("user_id");
        if (!userId) {
            console.log("No user information in request. Returning null for getCurrentUser()");
            return null;
        }
        console.log("Found user information in request.");
        const user = await UserModel.where({ id: userId });
        if (user.length <= 0) {
            this.current_user = null;
        }
        this.current_user = user[0];
        console.log(`Setting User #${this.current_user.id} as current user.`);
        return this.current_user;
    }
}
export default BaseResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2VfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLFNBQVMsTUFBTSx5QkFBeUIsQ0FBQztBQUVoRCxNQUFNLFlBQWEsU0FBUSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVE7SUFDckMsWUFBWSxHQUFxQixJQUFJLENBQUM7SUFZbkMsYUFBYSxDQUNyQixVQUFrQixFQUNsQixPQUFlO1FBRWYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDaEI7U0FDRixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFTUyx3QkFBd0I7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUN2QixHQUFHLEVBQ0gsOEJBQThCLENBQy9CLENBQUM7SUFDSixDQUFDO0lBUVMsS0FBSyxDQUFDLGNBQWM7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3pDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQzFCO1FBQ0QsTUFBTSxNQUFNLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQVk7WUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFZLENBQUM7UUFFbkQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMscUVBQXFFLENBQUMsQ0FBQztZQUNuRixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUN0RSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBRUQsZUFBZSxZQUFZLENBQUMifQ==