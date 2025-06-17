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
}