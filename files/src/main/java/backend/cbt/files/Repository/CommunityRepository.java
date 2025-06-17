package backend.cbt.files.Repository;

import backend.cbt.files.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByMemberIdsContaining(String userId);
}