package backend.cbt.files;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityService {
    private static final Logger logger = LoggerFactory.getLogger(CommunityService.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userservice;

    public Community createCommunity(Community community) {
        logger.info("Creating community: {}", community.getName());

        if ((userservice.findByEmail(community.getOwnerId())) == false) {
            logger.error("Community ownerId does not exist: {}", community.getOwnerId());
            throw new RuntimeException("No such user with this ownerId: " + community.getOwnerId());
        }

        try {
            Community savedCommunity = mongoTemplate.save(community, "Community");
            if (savedCommunity == null) {
                logger.error("Failed to save community: {}", community.getName());
                throw new RuntimeException("Failed to save community");
            }
            logger.info("Community created successfully: {}", community.getName());
            return savedCommunity;
        } catch (Exception e) {
            logger.error("Error saving community: {}", e.getMessage());
            throw new RuntimeException("Error saving community: " + e.getMessage());
        }
    }

    public Community updateCommunity(String id, Community updatedCommunity) {
        logger.info("Updating community with id: {}", id);
        Query query = new Query(Criteria.where("_id").is(id));
        Community existingCommunity = mongoTemplate.findOne(query, Community.class, "Community");
        if (existingCommunity == null) {
            logger.error("Community not found with id: {}", id);
            throw new RuntimeException("Community not found with id: " + id);
        }

        try {
            existingCommunity.setName(updatedCommunity.getName());
            existingCommunity.setDesc(updatedCommunity.getDesc());
            existingCommunity.setType(updatedCommunity.getType());
            // ownerId is not updated to prevent changing ownership
            Community savedCommunity = mongoTemplate.save(existingCommunity, "Community");
            logger.info("Community updated successfully: {}", id);
            return savedCommunity;
        } catch (Exception e) {
            logger.error("Error updating community: {}", e.getMessage());
            throw new RuntimeException("Error updating community: " + e.getMessage());
        }
    }

    public void deleteCommunity(String id) {
        logger.info("Deleting community with id: {}", id);
        Query query = new Query(Criteria.where("_id").is(id));
        Community existingCommunity = mongoTemplate.findOne(query, Community.class, "Community");
        if (existingCommunity == null) {
            logger.error("Community not found with id: {}", id);
            throw new RuntimeException("Community not found with id: " + id);
        }

        try {
            mongoTemplate.remove(query, Community.class, "Community");
            logger.info("Community deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting community: {}", e.getMessage());
            throw new RuntimeException("Error deleting community: " + e.getMessage());
        }
    }

    public List<Community> searchCommunitiesByName(String name) {
        logger.info("Searching communities with name containing: {}", name);
        try {
            Query query = new Query(Criteria.where("name").regex(name, "i").and("type").is("public"));
            List<Community> communities = mongoTemplate.find(query, Community.class, "Community");
            logger.info("Found {} public communities matching name: {}", communities.size(), name);
            return communities;
        } catch (Exception e) {
            logger.error("Error searching communities: {}", e.getMessage());
            throw new RuntimeException("Error searching communities: " + e.getMessage());
        }
    }
}