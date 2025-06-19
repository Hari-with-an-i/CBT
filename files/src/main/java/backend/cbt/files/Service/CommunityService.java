package backend.cbt.files.Service;

import backend.cbt.files.model.Community;
import backend.cbt.files.model.CommunityTask;
import backend.cbt.files.model.User;
import jakarta.annotation.PostConstruct;
import backend.cbt.files.Repository.CommunityRepository;
import backend.cbt.files.Repository.UserRepository;
import backend.cbt.files.Repository.CommunityTaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {
    private static final Logger logger = LoggerFactory.getLogger(CommunityService.class);

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityTaskRepository communityTaskRepository;

    @PostConstruct
    public void init() {
        logger.info("CommunityService initialized and ready");
    }

    public List<Community> getCommunitiesByUserId(String userId) {
        logger.info("Fetching communities for user: {}", userId);
        return communityRepository.findByMemberIdsContaining(userId);
    }

    public Community getCommunityById(String communityId) {
        logger.info("Querying 'communities' collection for ID: {}", communityId);
        Community community = communityRepository.findById(communityId).orElse(null);
        if (community == null) {
            logger.warn("No community found for ID: {}", communityId);
        } else {
            logger.info("Found community: {}", community.getName());
        }
        return community;
    }

    public List<String> getCommunityMembers(String communityId) {
        logger.info("Fetching members for communityId: {} from 'users' collection", communityId);
        Community community = getCommunityById(communityId);
        if (community == null) {
            logger.warn("Community not found, returning empty list");
            return List.of();
        }

        List<String> memberIds = community.getMemberIds();
        if (memberIds.isEmpty()) {
            logger.info("No members found for communityId: {}", communityId);
            return List.of();
        }

        logger.info("Querying 'users' collection for memberIds: {}", memberIds);
        List<User> users = userRepository.findByIdIn(memberIds);
        if (users.isEmpty()) {
            logger.warn("No users found for memberIds: {}", memberIds);
            return List.of();
        }

        List<String> emails = users.stream()
                .map(User::getEmail)
                .filter(email -> email != null && !email.isEmpty())
                .collect(Collectors.toList());
        logger.info("Returning emails: {}", emails);
        return emails;
    }

    public List<User> getTopUsersByPoints(String communityId, int limit) {
        logger.info("Fetching top {} users by points for communityId: {} from 'users' collection", limit, communityId);
        Community community = getCommunityById(communityId);
        if (community == null) {
            logger.warn("Community not found for communityId: {}", communityId);
            return List.of();
        }

        List<String> memberIds = community.getMemberIds();
        if (memberIds.isEmpty()) {
            logger.info("No members found for communityId: {}", communityId);
            return List.of();
        }

        List<User> users = userRepository.findByIdIn(memberIds);
        return users.stream()
                .sorted(Comparator.comparingInt(User::getPoints).reversed())
                .limit(limit)
                .collect(Collectors.toList());
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

    public CommunityTask createCommunityTask(String communityId, CommunityTask task) {
        logger.info("Creating community task for communityId: {} with memberEmails: {}", communityId, task.getMemberEmails());
        Community community = getCommunityById(communityId);
        if (community == null) {
            logger.warn("Community not found for ID: {}", communityId);
            throw new IllegalArgumentException("Community not found");
        }
        task.setCommunityId(communityId);
        return communityTaskRepository.save(task);
    }

    public List<CommunityTask> getCommunityTasks(String communityId) {
        logger.info("Fetching community tasks for communityId: {}", communityId);
        return communityTaskRepository.findByCommunityId(communityId);
    }
}