package backend.cbt.files.Controller;

import backend.cbt.files.model.Task;
import backend.cbt.files.Service.TaskService;
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
@RequestMapping("/api/tasks")
public class TaskController {
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUserId(@PathVariable String userId) {
        logger.info("Fetching tasks for user: {}", userId);
        List<Task> tasks = taskService.getTasksByUserId(userId);
        logger.debug("Fetched {} tasks for user: {}", tasks.size(), userId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        logger.info("Received POST request to create task for user: {}", task.getUserId());
        logger.debug("Task details: title={}, description={}, dueDate={}, status={}", 
            task.getTitle(), task.getDescription(), task.getDueDate(), task.getStatus());
        Task createdTask = taskService.createTask(task);
        logger.info("Task created successfully with ID: {}", createdTask.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable String taskId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            logger.info("Updating task {} status to: {}", taskId, status);
            Task updatedTask = taskService.updateTaskStatus(taskId, status);
            logger.debug("Task {} updated successfully", taskId);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            logger.error("Failed to update task status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}