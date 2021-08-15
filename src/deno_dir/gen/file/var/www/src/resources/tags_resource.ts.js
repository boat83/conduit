import BaseResource from "./base_resource.ts";
import { ArticleModel, } from "../models/article_model.ts";
class TagsResource extends BaseResource {
    static paths = [
        "/api/tags",
        "/api/tags/:id",
    ];
    async GET() {
        var allTags = new Set();
        const tags = await ArticleModel.allTags();
        tags.forEach((tagList) => {
            tagList.split(',').forEach((tag) => {
                allTags.add(tag);
            });
        });
        this.response.body = Array.from(allTags);
        return this.response;
    }
}
export default TagsResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnc19yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZ3NfcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sb0JBQW9CLENBQUM7QUFFOUMsT0FBTyxFQUVMLFlBQVksR0FFYixNQUFNLDRCQUE0QixDQUFDO0FBRXBDLE1BQU0sWUFBYSxTQUFRLFlBQVk7SUFDckMsTUFBTSxDQUFDLEtBQUssR0FBRztRQUNiLFdBQVc7UUFDWCxlQUFlO0tBQ2hCLENBQUM7SUFFSyxLQUFLLENBQUMsR0FBRztRQUNkLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDeEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWUsRUFBRSxFQUFFO1lBRS9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7O0FBSUgsZUFBZSxZQUFZLENBQUMifQ==