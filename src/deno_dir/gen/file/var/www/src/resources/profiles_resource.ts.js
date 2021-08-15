import BaseResource from "./base_resource.ts";
import UserModel from "../models/user_model.ts";
import UserFavoritesModel from "../models/user_favorites_model.ts";
class ProfilesResource extends BaseResource {
    static paths = [
        "/api/profiles/:username",
        "/api/profiles/:username/follow",
    ];
    async POST() {
        console.log("Handling ProfilesResource POST.");
        if (this.request.url_path.includes("/follow")) {
            return await this.createFollow();
        }
        this.response.body = {
            errors: {
                username: ["Not supported."],
            },
        };
        return this.response;
    }
    async DELETE() {
        console.log("Handling ProfilesResource DELETE.");
        if (this.request.url_path.includes("/follow")) {
            return await this.deleteFollow();
        }
        this.response.body = {
            errors: {
                username: ["Not supported."],
            },
        };
        return this.response;
    }
    async GET() {
        return this.getProfile();
    }
    async getProfile() {
        console.log("Handling ProfilesResource GET.");
        const username = this.request.getPathParam("username") || "";
        console.log(`Handling the following user's profile: ${username}.`);
        if (!username) {
            this.response.status_code = 422;
            this.response.body = {
                errors: {
                    username: ["Username path param is required."],
                },
            };
        }
        this.response.body = {
            profile: null,
        };
        const result = await UserModel.where({ username: username });
        if (result.length <= 0) {
            return this.errorResponse(404, "Profile not found.");
        }
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const entity = result[0].toEntity();
        entity.followed = await this.isFollowedProfile(result[0].id, currentUser.id);
        this.response.body = {
            profile: entity,
        };
        return this.response;
    }
    async createFollow() {
        console.log("Handling action: toggleFollow.");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const username = this.request.getPathParam("username") || "";
        console.log(`Handling the following user's profile: ${username}.`);
        if (!username) {
            this.response.status_code = 422;
            this.response.body = {
                errors: {
                    username: ["Username path param is required."],
                },
            };
        }
        this.response.body = {
            profile: null,
        };
        const result = await UserModel.where({ username: username });
        if (result.length <= 0) {
            return this.errorResponse(404, "Profile not found.");
        }
        let favorite;
        favorite = new UserFavoritesModel(result[0].id, currentUser.id, true, 0);
        await favorite.save();
        return this.getProfile();
    }
    async deleteFollow() {
        console.log("Handling action: deleteFollow.");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const username = this.request.getPathParam("username") || "";
        console.log(`Handling the following user's profile: ${username}.`);
        if (!username) {
            this.response.status_code = 422;
            this.response.body = {
                errors: {
                    username: ["Username path param is required."],
                },
            };
        }
        this.response.body = {
            profile: null,
        };
        const result = await UserModel.where({ username: username });
        if (result.length <= 0) {
            return this.errorResponse(404, "Profile not found.");
        }
        const uf = await UserFavoritesModel.where({ favorited_user_id: result[0].id, user_id: currentUser.id });
        if (uf.length > 0) {
            uf[0].delete();
        }
        return this.getProfile();
    }
    async isFollowedProfile(profile_id, user_id) {
        const uf = await UserFavoritesModel.where({ favorited_user_id: profile_id, user_id: user_id });
        if (uf.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
export default ProfilesResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZXNfcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxlc19yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLFNBQVMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLGtCQUFrQixNQUFNLG1DQUFtQyxDQUFDO0FBRW5FLE1BQU0sZ0JBQWlCLFNBQVEsWUFBWTtJQUN6QyxNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ2IseUJBQXlCO1FBQ3pCLGdDQUFnQztLQUNqQyxDQUFDO0lBRUssS0FBSyxDQUFDLElBQUk7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFL0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0MsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzthQUM3QjtTQUNGLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUVqRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QyxPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUc7WUFDbkIsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQzdCO1NBQ0YsQ0FBQztR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