package backend.cbt.files.Repository;

import backend.cbt.files.model.CommunityTask;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommunityTaskRepository extends MongoRepository<CommunityTask, String> {
    List<CommunityTask> findByCommunityId(String communityId);
    List<CommunityTask> findByCommunityIdAndMemberEmailsContaining(String communityId, String memberEmail);
}