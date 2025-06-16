package backend.cbt.files;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByNameContainingIgnoreCaseAndType(String name, String type);
}