package backend.cbt.files.Controller;

import backend.cbt.files.model.Community;
import backend.cbt.files.model.CommunityTask;
import backend.cbt.files.model.User;
import jakarta.annotation.PostConstruct;
import backend.cbt.files.Service.CommunityService;
import backend.cbt.files.Repository.CommunityRepository;
import backend.cbt.files.Repository.CommunityTaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/communities")
public class CommunityController {
    private static final Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private CommunityService communityService;

    @PostConstruct
    public void init() {
        logger.info("CommunityController initialized and ready to handle requests");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Community>> getCommunitiesByUserId(@PathVariable String userId) {
        logger.info("Fetching communities for user: {}", userId);
        List<Community> communities = communityService.getCommunitiesByUserId(userId);
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/{communityId}/members")
    public ResponseEntity<List<String>> getCommunityMembers(@PathVariable String communityId) {
        logger.info("Processing GET /api/communities/{}/members", communityId);
        try {
            List<String> members = communityService.getCommunityMembers(communityId);
            if (members.isEmpty()) {
                logger.warn("No members found for communityId: {}", communityId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            logger.info("Returning member emails: {}", members);
            return new ResponseEntity<>(members, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching members for communityId {}: {}", communityId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{communityId}/top-users")
    public ResponseEntity<List<User>> getTopUsers(@PathVariable String communityId, @RequestParam(defaultValue = "3") int limit) {
        logger.info("Received request to get top {} users for communityId: {} from 'users' collection", limit, communityId);
        try {
            List<User> topUsers = communityService.getTopUsersByPoints(communityId, limit);
            return new ResponseEntity<>(topUsers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching top users for communityId {}: {}", communityId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{communityId}/tasks")
    public ResponseEntity<List<CommunityTask>> getCommunityTasks(@PathVariable String communityId) {
        logger.info("Processing GET /api/communities/{}/tasks", communityId);
        try {
            List<CommunityTask> tasks = communityService.getCommunityTasks(communityId);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching community tasks for communityId {}: {}", communityId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{communityId}/tasks")
    public ResponseEntity<CommunityTask> createCommunityTask(@PathVariable String communityId, @RequestBody CommunityTask task) {
        logger.info("Processing POST /api/communities/{}/tasks with task: {}", communityId, task);
        try {
            CommunityTask createdTask = communityService.createCommunityTask(communityId, task);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating community task for communityId {}: {}", communityId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Community> createCommunity(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String name = request.get("name");
            String description = request.get("description");
            logger.info("Received request to create community: userId={}, name={}, description={}", userId, name, description);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Community community = communityService.createCommunity(userId, name, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(community);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid community creation request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            logger.error("Failed to create community: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Community>> searchCommunities(@RequestParam(required = false) String name) {
        logger.info("Searching communities with name query: {}", name);
        List<Community> communities = communityService.searchCommunities(name);
        return ResponseEntity.ok(communities);
    }

    @PostMapping("/{communityId}/join")
    public ResponseEntity<Community> joinCommunity(@PathVariable String communityId, @RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            logger.info("Received join request for community {} by user {}", communityId, userId);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Community community = communityService.joinCommunity(communityId, userId);
            return ResponseEntity.ok(community);
        } catch (RuntimeException e) {
            logger.error("Failed to join community: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            logger.error("Error processing join request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}