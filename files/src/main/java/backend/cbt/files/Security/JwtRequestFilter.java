package backend.cbt.files.Security;

import backend.cbt.files.Service.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        logger.debug("Processing request: method={}, path={}", method, path);

        // Skip authentication for auth endpoints and OPTIONS requests
        if (path.startsWith("/api/auth/") || "OPTIONS".equals(method)) {
            logger.debug("Skipping authentication for path: {} or method: {}", path, method);
            chain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String userId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token)) {
                    userId = jwtUtil.extractUserId(token);
                    logger.info("Token validated for user: {}", userId);

                    // Create Authentication object with authorities
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );

                    // Set Authentication in SecurityContext
                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    context.setAuthentication(auth);
                    SecurityContextHolder.setContext(context);
                    logger.debug("Authentication set in SecurityContext for user: {}. Authorities: {}", userId, auth.getAuthorities());
                } else {
                    logger.warn("Invalid JWT token: validation failed for token: {}", token);
                }
            } catch (Exception e) {
                logger.error("JWT token validation failed: {}", e.getMessage());
            }
        } else {
            logger.warn("Authorization header missing or does not start with Bearer for request: {}", path);
        }

        if (userId == null) {
            logger.error("Authentication failed for request {}: returning 401 Unauthorized", path);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Missing or invalid token");
            return;
        }

        // Log SecurityContext state before proceeding
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        if (currentAuth != null) {
            logger.debug("SecurityContext before chain: user={}, authorities={}", currentAuth.getName(), currentAuth.getAuthorities());
        } else {
            logger.warn("SecurityContext is empty before proceeding to filter chain for request: {}", path);
        }

        chain.doFilter(request, response);

        // Log SecurityContext state after filter chain (for debugging)
        currentAuth = SecurityContextHolder.getContext().getAuthentication();
        if (currentAuth != null) {
            logger.debug("SecurityContext after chain: user={}, authorities={}", currentAuth.getName(), currentAuth.getAuthorities());
        } else {
            logger.warn("SecurityContext is empty after filter chain for request: {}", path);
        }
    }
}