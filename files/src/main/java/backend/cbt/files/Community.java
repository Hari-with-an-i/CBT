package backend.cbt.files;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Community")
public class Community {

    @Id
    private String id;
    private String name;
    private String description;
    private String ownerId;
    private String type;

    // Constructors
    public Community() {}

    public Community(String name, String description, String ownerId, String type) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.type = type;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerid) {
        this.ownerId = ownerid;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return description;
    }

    public void setDesc(String description) {
        this.description = description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}


