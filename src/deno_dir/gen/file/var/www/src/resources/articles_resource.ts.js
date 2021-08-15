import BaseResource from "./base_resource.ts";
import { ArticleModel, } from "../models/article_model.ts";
import { ArticlesFavoritesModel } from "../models/articles_favorites_model.ts";
import UserModel from "../models/user_model.ts";
import UserFavoritesModel from "../models/user_favorites_model.ts";
class ArticlesResource extends BaseResource {
    static paths = [
        "/api/articles",
        "/api/articles/:slug",
        "/api/articles/:slug/favorite",
    ];
    async GET() {
        console.log("Handling ArticlesResource GET.");
        if (this.request.getPathParam("slug")) {
            return await this.getArticle();
        }
        return await this.getArticles();
    }
    async POST() {
        console.log("Handling ArticlesResource POST.");
        if (this.request.url_path.includes("/favorite")) {
            return await this.toggleFavorite();
        }
        return await this.createArticle();
    }
    async PUT() {
        console.log("Handling ArticlesResource PUT");
        return await this.updateArticle();
    }
    async DELETE() {
        console.log("Handling ArticlesResource DELETE");
        return await this.deleteArticle();
    }
    async addAuthorsToEntities(authorIds, entities) {
        const authors = await UserModel.whereIn("id", authorIds);
        entities.map((entity) => {
            authors.forEach((user) => {
                if (user.id === entity.author_id) {
                    entity.author = user.toEntity();
                }
            });
            return entity;
        });
        return entities;
    }
    async addFavoritedToEntities(articleIds, entities) {
        console.log("addFavoritedToEntities");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return entities;
        }
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        entities = entities.map((entity) => {
            favs.forEach((favorite) => {
                if (entity.id === favorite.article_id) {
                    if (currentUser.id === favorite.user_id) {
                        entity.favorited = favorite.value;
                    }
                }
            });
            return entity;
        });
        return entities;
    }
    async addFavoritesCountToEntities(articleIds, entities) {
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        entities.map((entity) => {
            favs.forEach((favorite) => {
                if (favorite.article_id == entity.id) {
                    if (favorite.value === true) {
                        entity.favoritesCount += 1;
                    }
                }
            });
            return entity;
        });
        return entities;
    }
    async updateArticle() {
        const inputArticle = this.request.getBodyParam("article")
            ? this.request.getBodyParam("article")
            : null;
        if (inputArticle === null) {
            return this.errorResponse(400, "Article parameter must be passed in");
        }
        const article = new ArticleModel(inputArticle.author_id, inputArticle.title, inputArticle.description, inputArticle.body, inputArticle.tags, inputArticle.slug, inputArticle.created_at, inputArticle.updated_at, inputArticle.id);
        await article.save();
        if (!article) {
            return this.errorResponse(500, "Article could not be saved.");
        }
        this.response.body = {
            article: article.toEntity(),
        };
        return this.response;
    }
    async deleteArticle() {
        const articleSlug = this.request.getPathParam("slug");
        if (!articleSlug) {
            return this.errorResponse(400, "No article slug was passed in");
        }
        const articleResult = await ArticleModel.where({ slug: articleSlug });
        if (!articleResult.length) {
            return this.errorResponse(500, "Failed to fetch the article by slug: " + articleSlug);
        }
        const article = articleResult[0];
        const deleted = await article.delete();
        if (deleted === false) {
            return this.errorResponse(500, "Failed to delete the article of slug: " + articleSlug);
        }
        this.response.body = {
            success: true,
        };
        return this.response;
    }
    async createArticle() {
        const inputArticle = this.request.getBodyParam("article");
        if (!inputArticle.title) {
            return this.errorResponse(400, "You must set the article title.");
        }
        const article = new ArticleModel(inputArticle.author_id, inputArticle.title, inputArticle.description || "", inputArticle.body || "", inputArticle.tags || "");
        await article.save();
        if (!article) {
            return this.errorResponse(500, "Article could not be saved.");
        }
        this.response.body = {
            article: article.toEntity(),
        };
        return this.response;
    }
    async getArticle() {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const slug = this.request.getPathParam("slug") || "";
        const articleResult = await ArticleModel.where({ slug: slug });
        if (articleResult.length <= 0) {
            return this.errorResponse(404, "Article not found.");
        }
        const article = articleResult[0];
        const userResult = await UserModel.where({ id: article.author_id });
        if (userResult.length <= 0) {
            return this.errorResponse(400, "Unable to determine the article's author.");
        }
        const user = userResult[0];
        const entity = article.toEntity();
        entity.author = user.toEntity();
        const favs = await ArticlesFavoritesModel
            .where({ article_id: article.id });
        if (favs) {
            favs.forEach((favorite) => {
                if (favorite.value === true) {
                    entity.favoritesCount += 1;
                }
            });
            favs.forEach((favorite) => {
                if (entity.id === favorite.article_id) {
                    if (currentUser.id === favorite.user_id) {
                        entity.favorited = favorite.value;
                    }
                }
            });
        }
        this.response.body = {
            article: entity,
        };
        return this.response;
    }
    async getArticlesCount() {
        return new Promise(async (resolve) => {
            const articles = await ArticleModel
                .all(await this.getQueryFilters(false));
            const articleIds = [];
            const authorIds = [];
            let entities = articles.map((article) => {
                if (authorIds.indexOf(article.author_id) === -1) {
                    authorIds.push(article.author_id);
                }
                if (articleIds.indexOf(article.id) === -1) {
                    articleIds.push(article.id);
                }
                return article.toEntity();
            });
            entities = await this.addAuthorsToEntities(authorIds, entities);
            entities = await this.addFavoritesCountToEntities(articleIds, entities);
            entities = await this.addFavoritedToEntities(articleIds, entities);
            entities = await this.filterEntitiesByFavoritedBy(articleIds, entities);
            resolve(entities.length);
        });
    }
    async getArticles() {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        console.log("getArticles", "filters", await this.getQueryFilters(true));
        const articles = await ArticleModel
            .all(await this.getQueryFilters(true));
        const articleIds = [];
        const authorIds = [];
        let entities = articles.map((article) => {
            if (authorIds.indexOf(article.author_id) === -1) {
                authorIds.push(article.author_id);
            }
            if (articleIds.indexOf(article.id) === -1) {
                articleIds.push(article.id);
            }
            return article.toEntity();
        });
        const favoritedAuthorIds = [];
        const userFavorites = await UserFavoritesModel
            .all(currentUser.id);
        console.log("userFavorites", userFavorites);
        userFavorites.forEach(element => {
            favoritedAuthorIds.push(element.favorited_user_id);
        });
        console.log("favoritedAuthorIds", favoritedAuthorIds);
        entities = await this.addAuthorsToEntities(authorIds, entities);
        entities = await this.addFavoritesCountToEntities(articleIds, entities);
        entities = await this.addFavoritedToEntities(articleIds, entities);
        entities = await this.filterEntitiesByFavoritedBy(articleIds, entities);
        let count = await this.getArticlesCount();
        this.response.body = {
            articles: entities,
            articles_count: count
        };
        return this.response;
    }
    async filterEntitiesByFavoritedAuthors(favoritedAuthorIds, entities) {
        console.log(entities);
        const filtered = [];
        entities.forEach((entity) => {
            console.log(entity);
            favoritedAuthorIds.forEach((favorite) => {
                console.log(favorite);
                if (entity.author_id === favorite) {
                    console.log("pushed", entity);
                    filtered.push(entity);
                }
            });
        });
        return filtered;
    }
    async filterEntitiesByFavoritedBy(articleIds, entities) {
        const favs = await ArticlesFavoritesModel
            .whereIn("article_id", articleIds);
        const username = this.request.getUrlQueryParam("favorited_by");
        if (!username) {
            return entities;
        }
        const results = await UserModel.where({ username: username });
        if (results.length <= 0) {
            return entities;
        }
        const user = results[0];
        const filtered = [];
        entities.forEach((entity) => {
            favs.forEach((favorite) => {
                if (entity.id === favorite.article_id) {
                    if (user.id === favorite.user_id) {
                        if (favorite.value === true) {
                            entity.favorited = true;
                            filtered.push(entity);
                        }
                    }
                }
            });
        });
        return filtered;
    }
    async getQueryFilters(withOffset = false) {
        const author = this.request.getUrlQueryParam("author");
        const tag = this.request.getUrlQueryParam("tag");
        const offset = this.request.getUrlQueryParam("offset");
        const filters = {};
        if (author) {
            const authorUser = await UserModel.where({ username: author });
            if (authorUser.length > 0) {
                filters.author = authorUser[0];
            }
        }
        if (tag) {
            filters.tag = tag;
        }
        if (offset && withOffset) {
            filters.offset = Number(offset);
        }
        return filters;
    }
    async toggleFavorite() {
        console.log("Handling action: toggleFavorite.");
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            return this.errorResponse(400, "`user_id` field is required.");
        }
        const slug = this.request.getPathParam("slug") || "";
        const result = await ArticleModel.where({ slug: slug });
        if (result.length <= 0) {
            return this.errorResponse(404, `Article with slug "${slug}" not found.`);
        }
        const article = result[0];
        let favorite;
        const action = this.request.getBodyParam("action");
        switch (action) {
            case "set":
                favorite = await ArticlesFavoritesModel.where({
                    article_id: article.id,
                    user_id: currentUser.id,
                });
                if (favorite.length > 0) {
                    favorite[0].value = true;
                    await favorite[0].save();
                }
                else {
                    favorite = new ArticlesFavoritesModel(article.id, currentUser.id, true);
                    await favorite.save();
                }
                break;
            case "unset":
                favorite = await ArticlesFavoritesModel.where({
                    article_id: article.id,
                    user_id: currentUser.id,
                });
                if (!favorite) {
                    return this.errorResponse(404, "Can't unset favorite on article that doesn't have any favorites.");
                }
                favorite[0].value = false;
                await favorite[0].save();
                break;
        }
        return this.getArticle();
    }
}
export default ArticlesResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZXNfcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcnRpY2xlc19yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBRUwsWUFBWSxHQUViLE1BQU0sNEJBQTRCLENBQUM7QUFDcEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxTQUFTLE1BQU0seUJBQXlCLENBQUM7QUFDaEQsT0FBTyxrQkFBa0IsTUFBTSxtQ0FBbUMsQ0FBQztBQUVuRSxNQUFNLGdCQUFpQixTQUFRLFlBQVk7SUFDekMsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLGVBQWU7UUFDZixxQkFBcUI7UUFDckIsOEJBQThCO0tBQy9CLENBQUM7SUFNSyxLQUFLLENBQUMsR0FBRztRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDaEM7UUFFRCxPQUFPLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUUvQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMvQyxPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUc7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixD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