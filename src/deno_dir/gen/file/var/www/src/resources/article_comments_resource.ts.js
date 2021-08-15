import { ArticleModel } from "../models/article_model.ts";
import { ArticleCommentsModel } from "../models/article_comments_model.ts";
import UserService from "../services/user_service.ts";
import BaseResource from "./base_resource.ts";
export default class ArticleCommentsResource extends BaseResource {
    static paths = [
        "/api/articles/:slug/comments",
        "/api/articles/comment/:id",
    ];
    async GET() {
        const slug = this.request.getPathParam("slug") || "";
        const articles = await ArticleModel.where({ slug });
        if (!articles.length) {
            console.error("No article was found with the slug of: " + slug);
            this.response.status_code = 404;
            this.response.body = {
                errors: {
                    comment: "No article was found for the given article",
                },
            };
            return this.response;
        }
        const article = articles[0];
        const comments = await ArticleCommentsModel.whereIn("article_id", [article.id]);
        if (!comments.length) {
            console.log("No comments were found for the article with id: " + article.id);
            this.response.body = [];
            return this.response;
        }
        console.log("Returning comments (length of " + comments.length +
            ") for article with id: " + article.id);
        this.response.body = {
            success: true,
            data: comments,
        };
        return this.response;
    }
    async POST() {
        console.log("Handling ArticleCommentsResource POST.");
        const comment = this.request.getBodyParam("comment");
        const slug = this.request.getPathParam("slug") || "";
        console.log("The slug for the article: " + slug);
        const articles = await ArticleModel.where({ slug });
        if (!articles.length) {
            return this.errorResponse(404, "No article was found.");
        }
        const article = articles[0];
        if (!comment) {
            return this.errorResponse(422, "A comment is required to post.");
        }
        const cookie = this.request.getCookie("drash_sess");
        const user = await UserService.getLoggedInUser(cookie || "");
        if (typeof user === "boolean") {
            return this.errorResponse(403, "You are unauthorised to complete this action.");
        }
        const articleComment = new ArticleCommentsModel(article.id, comment, user.image, user.id, user.username);
        const savedArticleComment = await articleComment
            .save();
        if (!savedArticleComment) {
            return this.errorResponse(500, "Failed to save the comment.");
        }
        const articleEntity = savedArticleComment.toEntity();
        this.response.status_code = 200;
        this.response.body = {
            success: true,
            data: articleEntity,
        };
        return this.response;
    }
    async DELETE() {
        console.log("Handling ArticleCommentsResource DELETE.");
        const cookie = this.request.getCookie("drash_sess");
        const user = await UserService.getLoggedInUser(cookie || "");
        if (typeof user === "boolean") {
            return this.errorResponse(403, "You are unauthorised to do this action.");
        }
        const commentId = Number(this.request.getPathParam("id")) || 0;
        console.log("going to get comments");
        const comments = await ArticleCommentsModel.where({ author_id: user.id });
        const isTheirComment = comments.filter((comment) => {
            return comment.id == Number(commentId);
        }).length >= 0;
        if (!isTheirComment) {
            return this.errorResponse(403, "You are unauthorised to do this action.");
        }
        const articleCommentsModel = new ArticleCommentsModel(0, ", ", "", 0, ", ", 0, 0, commentId);
        articleCommentsModel.id = Number(commentId);
        await articleCommentsModel.delete();
        this.response.body = {
            message: "Deleted the comment",
            success: true,
        };
        return this.response;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZV9jb21tZW50c19yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFydGljbGVfY29tbWVudHNfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzNFLE9BQU8sV0FBVyxNQUFNLDZCQUE2QixDQUFDO0FBQ3RELE9BQU8sWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBRzlDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sdUJBQXdCLFNBQVEsWUFBWTtJQUMvRCxNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ2IsOEJBQThCO1FBQzlCLDJCQUEyQjtLQUM1QixDQUFDO0lBRUssS0FBSyxDQUFDLEdBQUc7UUFDZCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckQsTUFBTSxRQUFRLEdBQUcsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRztnQkFDbkIsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSw0Q0FBNEM7aUJBQ3REO2FBQ0YsQ0FBQztZQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLG9CQUFvQixD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