package backend.cbt.files.Service;

import backend.cbt.files.model.Community;
import backend.cbt.files.Repository.CommunityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityService {
    private static final Logger logger = LoggerFactory.getLogger(CommunityService.class);

    @Autowired
    private CommunityRepository communityRepository;

    public List<Community> getCommunitiesByUserId(String userId) {
        logger.info("Fetching communities for user: {}", userId);
        return communityRepository.findByMemberIdsContaining(userId);
    }

    public Community createCommunity(String userId, String name, String description) {
        logger.info("Creating community for user: {}, name: {}", userId, name);
        if (name == null || name.trim().isEmpty()) {
            logger.error("Community name cannot be empty");
            throw new IllegalArgumentException("Community name is required");
        }

        Community community = new Community(name, description);
        community.getMemberIds().add(userId);
        Community savedCommunity = communityRepository.save(community);
        logger.info("Community created successfully with ID: {}", savedCommunity.getId());
        return savedCommunity;
    }

    public List<Community> searchCommunities(String query) {
        logger.info("Searching communities with query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return communityRepository.findAll();
        }
        return communityRepository.findByNameRegex(query);
    }

    public Community joinCommunity(String communityId, String userId) {
        logger.info("User {} attempting to join community: {}", userId, communityId);
        Community community = communityRepository.findById(communityId)
            .orElseThrow(() -> new RuntimeException("Community not found"));
        if (community.getMemberIds().contains(userId)) {
            logger.warn("User {} is already a member of community {}", userId, communityId);
            return community;
        }
        community.getMemberIds().add(userId);
        Community updatedCommunity = communityRepository.save(community);
        logger.info("User {} successfully joined community {}", userId, communityId);
        return updatedCommunity;
    }
}