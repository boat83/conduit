import BaseModel from "./base_model.ts";
export function createArticleModelObject(article) {
    return new ArticleModel(article.author_id, article.title, article.description, article.body, article.tags, article.slug, article.created_at, article.updated_at, article.id);
}
export class ArticleModel extends BaseModel {
    author_id;
    body;
    tags;
    created_at;
    description;
    favorited = false;
    favoritesCount = 0;
    id;
    slug;
    title;
    updated_at;
    constructor(authorId, title, description, body, tags = "", slug = "", createdAt = Date.now(), updatedAt = Date.now(), id = -1) {
        super();
        this.id = id;
        this.author_id = authorId;
        this.title = title;
        this.description = description;
        this.body = body;
        this.tags = tags;
        this.slug = this.id == -1 ? this.createSlug(title) : slug;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
    async delete() {
        const query = `DELETE FROM articles WHERE id = $1`;
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
        const query = "INSERT INTO articles " +
            " (author_id, title, description, body, slug, created_at, updated_at, tags)" +
            " VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), $8);";
        const dbResult = await BaseModel.query(query, this.author_id, this.title, this.description, this.body, this.createSlug(this.title), Date.now() / 1000.00, Date.now() / 1000.00, this.tags);
        if (dbResult.rowCount < 1) {
            return [];
        }
        const savedResult = await ArticleModel.where({ slug: this.slug });
        if (savedResult.length === 0) {
            return [];
        }
        return savedResult[0];
    }
    async update() {
        const query = "UPDATE articles SET " +
            "title = $1, description = $2, body = $3, updated_at = to_timestamp($4), tags = $5 " +
            `WHERE id = '${this.id}';`;
        const dbResult = await BaseModel.query(query, this.title, this.description, this.body, Date.now(), this.tags);
        if (dbResult.rowCount < 1) {
            return [];
        }
        const updatedResult = await ArticleModel.where({ id: this.id });
        if (updatedResult.length === 0) {
            return [];
        }
        return updatedResult[0];
    }
    static async all(filters) {
        let query = "SELECT * FROM articles ";
        if (filters.author) {
            query += ` WHERE author_id = '${filters.author.id}' `;
        }
        if (filters.tag) {
            query += ` WHERE tags LIKE '%${filters.tag}%' `;
        }
        if (filters.offset) {
            query += ` OFFSET ${filters.offset} `;
        }
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        if (dbResult.rows.length === 0) {
            return [];
        }
        const articles = [];
        dbResult.rows.forEach((result) => {
            const entity = {
                id: typeof result.id === "number" ? result.id : 0,
                body: typeof result.body === "string" ? result.body : "",
                "author_id": typeof result.author_id === "number"
                    ? result.author_id
                    : 0,
                "created_at": typeof result.created_at === "number"
                    ? result.created_at
                    : 0,
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    static async allTags() {
        let query = "SELECT tags FROM articles ";
        const dbResult = await BaseModel.query(query);
        if (dbResult.rowCount < 1) {
            return [];
        }
        if (dbResult.rows.length === 0) {
            return [];
        }
        const articles = Array();
        dbResult.rows.forEach((result) => {
            articles.push(result.tags);
        });
        return articles;
    }
    static async where(fields) {
        const results = await BaseModel.Where("articles", fields);
        if (results.length <= 0) {
            return [];
        }
        const articles = [];
        results.forEach((result) => {
            const entity = {
                id: typeof result.id === "number" ? result.id : 0,
                body: typeof result.body === "string" ? result.body : "",
                "author_id": typeof result.author_id === "number"
                    ? result.author_id
                    : 0,
                "created_at": typeof result.created_at === "number"
                    ? result.created_at
                    : 0,
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    static async whereIn(column, values) {
        const results = await BaseModel.WhereIn("articles", {
            column,
            values,
        });
        if (results.length <= 0) {
            return [];
        }
        const articles = [];
        results.forEach((result) => {
            const entity = {
                id: typeof result.id === "number" ? result.id : 0,
                body: typeof result.body === "string" ? result.body : "",
                "author_id": typeof result.author_id === "number"
                    ? result.author_id
                    : 0,
                "created_at": typeof result.created_at === "number"
                    ? result.created_at
                    : 0,
                description: typeof result.description === "string"
                    ? result.description
                    : "",
                favorited: typeof result.favorited === "boolean"
                    ? result.favorited
                    : false,
                favoritesCount: typeof result.favoritesCount === "number"
                    ? result.favoritesCount
                    : 0,
                title: typeof result.title === "string" ? result.title : "",
                "updated_at": typeof result.updated_at === "number"
                    ? result.updated_at
                    : 0,
                tags: typeof result.tags === "string" ? result.tags : "",
                slug: typeof result.slug === "string" ? result.slug : "",
            };
            articles.push(createArticleModelObject(entity));
        });
        return articles;
    }
    toEntity() {
        return {
            id: this.id,
            author_id: this.author_id,
            title: this.title,
            description: this.description,
            favorited: this.favorited,
            favoritesCount: this.favoritesCount,
            body: this.body,
            tags: this.tags,
            slug: this.slug,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
    createSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s/g, "-");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZV9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFydGljbGVfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0saUJBQWlCLENBQUM7QUFtQ3hDLE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxPQUFzQjtJQUM3RCxPQUFPLElBQUksWUFBWSxDQUNyQixPQUFPLENBQUMsU0FBUyxFQUNqQixPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxXQUFXLEVBQ25CLE9BQU8sQ0FBQyxJQUFJLEVBQ1osT0FBTyxDQUFDLElBQUksRUFDWixPQUFPLENBQUMsSUFBSSxFQUNaLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxFQUFFLENBQ1gsQ0FBQztBQUNKLENBQUM7QUFJRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFNBQVM7SUFVbEMsU0FBUyxDQUFTO0lBT2xCLElBQUksQ0FBUztJQVViLElBQUksQ0FBUztJQU9iLFVBQVUsQ0FBUztJQU9uQixXQUFXLENBQVM7SUFPcEIsU0FBUyxHQUFHLEtBQUssQ0FBQztJQU9sQixjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBT25CLEVBQUUsQ0FBUztJQU9YLElBQUksQ0FBUztJQU9iLEtBQUssQ0FBUztJQU9kLFVBQVUsQ0FBUztJQWlCMUIsWUFDRSxRQUFnQixFQUNoQixLQUFhLEVBQ2IsV0FBbUIsRUFDbkIsSUFBWSxFQUNaLE9BQWUsRUFBRSxFQUNqQixPQUFlLEVBQUUsRUFDakIsWUFBb0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUM5QixZQUFvQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQzlCLEtBQWEsQ0FBQyxDQUFDO1FBRWYsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFL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