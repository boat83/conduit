import BaseModel from "./base_model.ts";
export function createUserModelObject(user) {
    return new UserModel(user.username, user.password, user.followed, user.email, user.bio, user.image, user.id);
}
export class UserModel extends BaseModel {
    bio;
    email;
    id;
    image;
    password;
    username;
    followed;
    constructor(username, password, followed = false, email, bio = "", image = "https://static.productionready.io/images/smiley-cyrus.jpg", id = -1) {
        super();
        this.id = id;
        this.followed = followed;
        this.username = username;
        this.password = password;
        this.email = email;
        this.bio = bio;
        this.image = image;
    }
    async delete() {
        const query = `DELETE FROM users WHERE id = $1`;
        const dbResult = await BaseModel.query(query, this.id);
        if (dbResult.rowCount < 1) {
            return false;
        }
        return true;
    }
    async save() {
        if (this.id != -1) {
            return this.update();
        }
        const query = "INSERT INTO users (username, email, password, bio, image) VALUES ($1, $2, $3, $4, $5);";
        const dbResult = await BaseModel.query(query, this.username, this.email, this.password, this.bio, this.image);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const savedResult = await UserModel.where({ email: this.email });
        if (savedResult.length === 0) {
            return null;
        }
        return savedResult[0];
    }
    async update() {
        const query = "UPDATE users SET " +
            "username = $1, password = $2, email = $3, bio = $4, image = $5 " +
            `WHERE id = $6;`;
        const dbResult = await BaseModel.query(query, this.username, this.password, this.email, this.bio, this.image, this.id);
        if (dbResult.rowCount < 1) {
            return null;
        }
        const updatedResult = await UserModel.where({ email: this.email });
        if (updatedResult.length === 0) {
            return null;
        }
        return updatedResult[0];
    }
    static async where(fields) {
        const results = await BaseModel.Where("users", fields);
        if (results.length <= 0) {
            return [];
        }
        return results.map((result) => {
            return createUserModelObject(result);
        });
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("users", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        return results.map((result) => {
            return createUserModelObject(result);
        });
    }
    toEntity() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            bio: this.bio,
            image: this.image,
            token: null,
        };
    }
}
export default UserModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXJfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUEyQnhDLE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxJQVFyQztJQUNDLE9BQU8sSUFBSSxTQUFTLENBQ2xCLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxFQUFFLENBRVIsQ0FBQztBQUNKLENBQUM7QUFJRCxNQUFNLE9BQU8sU0FBVSxTQUFRLFNBQVM7SUFVL0IsR0FBRyxDQUFTO0lBT1osS0FBSyxDQUFTO0lBT2QsRUFBRSxDQUFTO0lBT1gsS0FBSyxDQUFTO0lBT2QsUUFBUSxDQUFTO0lBT2pCLFFBQVEsQ0FBUztJQUVqQixRQUFRLENBQVU7SUFjekIsWUFDRSxRQUFnQixFQUNoQixRQUFnQixFQUNoQixXQUFvQixLQUFLLEVBQ3pCLEtBQWEsRUFDYixNQUFjLEVBQUUsRUFDaEIsUUFBZ0IsMkRBQTJELEVBQzNFLEtBQWEsQ0FBQyxDQUFDO1FBRWYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQVdNLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLGlDQUFpQyxDQUFDO1FBQ2hELE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksUUFBUSxDQUFDLFFBQVMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU9NLEtBQUssQ0FBQyxJQUFJO1FBRWYsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxLQUFLLEdBQ1Qsd0ZBQXdGLENBQUM7UUFDM0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUNwQyxLQUFLLEVBQ0wsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsS0FBSyxDQUNYLENBQUM7UUFDRixJQUFJLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFHRCxNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDakUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQU9NLEtBQUssQ0FBQyxNQUFNO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLG1CQUFtQjtZQUMvQixpRUFBaUU7WUFDakUsZ0JBQWdCLENBQUM7UUFDbkIsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUNwQyxLQUFLLEVBQ0wsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxFQUFFLENBQ1IsQ0FBQztRQUNGLElBQUksUUFBUSxDQUFDLFFBQVMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sYUFBYSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNuRSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBY0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQ2hCLE1BQTBDO1FBRTFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdkQsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBSUQsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDNUIsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFXRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDbEIsTUFBYyxFQUNkLE1BQTJCO1FBRTNCLE1BQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDL0MsTUFBTTtZQUNOLE1BQU07U0FDUCxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFJRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM1QixPQUFPLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVNNLFFBQVE7UUFDYixPQUFPO1lBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsZUFBZSxTQUFTLENBQUMifQ==