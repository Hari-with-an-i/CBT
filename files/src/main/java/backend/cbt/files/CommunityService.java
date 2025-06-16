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

}