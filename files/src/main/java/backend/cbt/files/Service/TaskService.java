package backend.cbt.files.Service;

import backend.cbt.files.model.Task;
import backend.cbt.files.model.User;
import backend.cbt.files.Repository.TaskRepository;
import backend.cbt.files.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getTasksByUserId(String userId) {
        logger.info("Fetching tasks for user: {}", userId);
        return taskRepository.findByUserId(userId);
    }

    public Task createTask(Task task) {
        logger.info("Creating task for user: {}", task.getUserId());
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(String taskId, String status) {
        logger.info("Updating task {} to status: {}", taskId, status);
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        task = taskRepository.save(task);

        // Increment user's points if status is "Done"
        if ("Done".equals(status)) {
            User user = userRepository.findById(task.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPoints(user.getPoints() + 10); // Add 10 points for completing a task
            userRepository.save(user);
            logger.info("Incremented points for user {}: new total = {}", user.getId(), user.getPoints());
        }

        return task;
    }
}