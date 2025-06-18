package backend.cbt.files.Service;

import backend.cbt.files.model.Task;
import backend.cbt.files.model.User;
import backend.cbt.files.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService;

    public List<Task> getTasksByUserId(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId));
        return mongoTemplate.find(query, Task.class);
    }

    public Task createTask(Task task) {
        if (task.getCategory() == null || (!task.getCategory().equals("Personal") && !task.getCategory().equals("Community"))) {
            task.setCategory("Personal");
        }
        return mongoTemplate.save(task);
    }

    public Task updateTaskStatus(String taskId, String status) {
        logger.info("Updating task status for taskId: {}, new status: {}", taskId, status);
        Query query = new Query(Criteria.where("id").is(taskId));
        Task task = mongoTemplate.findOne(query, Task.class);
        if (task == null) {
            logger.error("Task not found for taskId: {}", taskId);
            throw new RuntimeException("Task not found");
        }

        logger.debug("Current task status: {}", task.getStatus());
        boolean isCompleting = status.equals("Completed") && !task.getStatus().equals("Completed");
        logger.info("Is task being marked as Completed? {}", isCompleting);

        task.setStatus(status);
        Task updatedTask = mongoTemplate.save(task);
        logger.info("Task status updated successfully: {}", updatedTask);

        if (isCompleting) {
            logger.info("Task is newly completed, updating user points for userId: {}", task.getUserId());
            try {
                User user = userService.getUserById(task.getUserId());
                logger.debug("Current user points: {}", user.getPoints());
                int newPoints = user.getPoints() + 10;
                user.setPoints(newPoints);
                // Use UserService to save the updated user
                userService.saveUser(user); // New method to be added
                logger.info("User points updated successfully to: {}", newPoints);
            } catch (Exception e) {
                logger.error("Failed to update user points: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to update user points: " + e.getMessage());
            }
        } else {
            logger.info("Task not marked as Completed, skipping points update.");
        }

        return updatedTask;
    }

    public void deleteTask(String taskId) {
        Query query = new Query(Criteria.where("id").is(taskId));
        mongoTemplate.remove(query, Task.class);
    }
}