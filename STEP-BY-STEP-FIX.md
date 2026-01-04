# STEP-BY-STEP FIX FOR CLICKABLE EMAIL LINKS

## Problem
Your backend is sending plain text emails instead of HTML emails with clickable links.

## EXACT STEPS TO FIX:

### Step 1: Update Your InvitationService.java
Replace your current `sendInvitation` method with this:

```java
@Service
public class InvitationService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private InvitationRepository invitationRepository;
    
    public void sendInvitation(String email, Long projectId) throws Exception {
        // Generate token
        String token = UUID.randomUUID().toString();
        
        // Save to database
        Invitation invitation = new Invitation();
        invitation.setEmail(email);
        invitation.setProjectId(projectId.toString());
        invitation.setToken(token);
        invitation.setExpiryDate(LocalDateTime.now().plusDays(7));
        invitation.setAccepted(false);
        invitationRepository.save(invitation);
        
        // Send HTML email
        sendHtmlEmail(email, token);
    }
    
    private void sendHtmlEmail(String email, String token) {
        try {
            // CRITICAL: Use MimeMessage, NOT SimpleMailMessage
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(email);
            helper.setSubject("Project Invitation");
            
            String link = "http://localhost:5173/accept-invitation?token=" + token;
            
            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>You're invited to join our project!</h2>
                    <p>Click the button below to accept:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" 
                           style="background-color: #007bff; 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  display: inline-block;
                                  font-weight: bold;">
                            Click Here to Join Project
                        </a>
                    </div>
                    <p>Link: %s</p>
                </div>
                """, link, link);
            
            // CRITICAL: Set HTML content (true = HTML)
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
        } catch (Exception e) {
            throw new RuntimeException("Email failed", e);
        }
    }
}
```

### Step 2: Add Required Imports
Add these imports to your InvitationService:

```java
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.UUID;
```

### Step 3: Update Invitation Entity
Add these fields to your Invitation.java:

```java
@Entity
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String projectId;
    private String token;           // ADD THIS
    private LocalDateTime expiryDate;  // ADD THIS
    private boolean accepted = false;  // ADD THIS
    private LocalDateTime acceptedDate; // ADD THIS
    
    // getters and setters...
}
```

### Step 4: Update Repository
Add this method to InvitationRepository:

```java
@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByToken(String token);
}
```

### Step 5: Fix Controller
Update your accept invitation endpoint:

```java
@GetMapping("/accept_invitation")
public ResponseEntity<Invitation> acceptInviteProject(
        @RequestHeader("Authorization") String jwt,
        @RequestParam String token) throws Exception {  // Remove @RequestBody
    
    User user = userService.findUserProfileByJwt(jwt);
    Invitation invitation = invitationService.acceptInvitation(token, user.getId());
    projectService.addUserToProject(Long.valueOf(invitation.getProjectId()), user.getId());
    return new ResponseEntity<>(invitation, HttpStatus.ACCEPTED);
}
```

## KEY DIFFERENCES:
- ✅ `MimeMessage` instead of `SimpleMailMessage`
- ✅ `helper.setText(htmlContent, true)` - the `true` makes it HTML
- ✅ Proper HTML with inline CSS for email clients
- ✅ Token generation and database storage
- ✅ Clickable `<a>` tag with proper styling

## Test:
1. Apply these changes
2. Restart your backend
3. Send a new invitation
4. Check email - you should see a blue clickable button
