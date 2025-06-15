package backend.cbt.files;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {
    private static final Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private CommunityService communityService;

    @PostMapping
    public ResponseEntity<Community> createCommunity(@RequestBody Community community) {
        logger.info("Received request to create community: {}", community.getName());
        Community createdCommunity = communityService.createCommunity(community);
        return ResponseEntity.ok(createdCommunity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(@PathVariable String id, @RequestBody Community community) {
        logger.info("Received request to update community with id: {}", id);
        Community updatedCommunity = communityService.updateCommunity(id, community);
        return ResponseEntity.ok(updatedCommunity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable String id) {
        logger.info("Received request to delete community with id: {}", id);
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Community>> searchCommunities(@RequestParam String name) {
        logger.info("Received request to search communities with name: {}", name);
        List<Community> communities = communityService.searchCommunitiesByName(name);
        return ResponseEntity.ok(communities);
    }
}