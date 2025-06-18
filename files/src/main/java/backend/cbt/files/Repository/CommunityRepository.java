package backend.cbt.files.Repository;

import backend.cbt.files.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByMemberIdsContaining(String userId);

    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }")
    List<Community> findByNameRegex(String nameRegex);
}