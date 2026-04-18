import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 900
SCREEN_HEIGHT = 700

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (52, 152, 219)
GREEN = (46, 204, 113)
RED = (231, 76, 60)
GRAY = (149, 165, 166)
LIGHT_BLUE = (174, 194, 224)

# Create screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Finnegan's History Quiz")
clock = pygame.time.Clock()

# Font
font_large = pygame.font.Font(None, 48)
font_medium = pygame.font.Font(None, 32)
font_small = pygame.font.Font(None, 24)

# Quiz Questions
QUIZ_QUESTIONS = [
    # Wessex & Early England
    {
        "question": "Who was the King of Wessex that defended against Viking invasions?",
        "options": ["Alfred the Great", "William the Conqueror", "Richard the Lionheart", "King John"],
        "correct": 0,
        "category": "Wessex"
    },
    {
        "question": "In what year was the Treaty of Wedmore signed?",
        "options": ["878 AD", "1066 AD", "1215 AD", "1348 AD"],
        "correct": 0,
        "category": "Wessex"
    },
    {
        "question": "What was the Danelaw?",
        "options": ["Region controlled by Vikings", "A peace treaty", "A Viking weapon", "Alfred's law code"],
        "correct": 0,
        "category": "Wessex"
    },
    
    # Medieval England
    {
        "question": "What year was the Norman Conquest?",
        "options": ["1066", "1215", "1348", "1453"],
        "correct": 0,
        "category": "Medieval"
    },
    {
        "question": "Who created the Magna Carta?",
        "options": ["King John", "Richard the Lionheart", "William the Conqueror", "Henry VIII"],
        "correct": 0,
        "category": "Medieval"
    },
    {
        "question": "What conflict was fought between the Houses of York and Lancaster?",
        "options": ["Wars of the Roses", "Hundred Years' War", "Norman Conquest", "English Civil War"],
        "correct": 0,
        "category": "Medieval"
    },
    
    # Early Modern & Modern
    {
        "question": "What devastating event killed roughly half of England's population (1348-1350)?",
        "options": ["The Black Death", "The Spanish Armada", "World War I", "The English Civil War"],
        "correct": 0,
        "category": "Modern"
    },
    {
        "question": "Which king broke from Rome and created the Church of England?",
        "options": ["Henry VIII", "Elizabeth I", "Charles I", "James I"],
        "correct": 0,
        "category": "Modern"
    },
    {
        "question": "What was England's naval victory against Spain?",
        "options": ["The Spanish Armada", "Battle of Hastings", "Battle of Bosworth", "Battle of Crécy"],
        "correct": 0,
        "category": "Modern"
    },
    {
        "question": "Who was the 'Virgin Queen' known for England's Golden Age?",
        "options": ["Elizabeth I", "Mary I", "Anne Boleyn", "Catherine of Aragon"],
        "correct": 0,
        "category": "Modern"
    },
    {
        "question": "In which year did World War II begin?",
        "options": ["1939", "1914", "1918", "1945"],
        "correct": 0,
        "category": "Modern"
    },
    {
        "question": "What was the Spanish Civil War also known as?",
        "options": ["Spanish Revolution", "Spanish Uprising", "Spanish Conflict", "Spanish Rebellion"],
        "correct": 0,
        "category": "Modern"
    }
]

class Button:
    def __init__(self, x, y, width, height, text, color, text_color):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = color
        self.text_color = text_color
        self.is_hovered = False
    
    def draw(self, surface):
        color = self.color if not self.is_hovered else tuple(min(c + 30, 255) for c in self.color)
        pygame.draw.rect(surface, color, self.rect, border_radius=10)
        pygame.draw.rect(surface, self.text_color, self.rect, 3, border_radius=10)
        
        text_surf = font_medium.render(self.text, True, self.text_color)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)
    
    def is_clicked(self, pos):
        return self.rect.collidepoint(pos)
    
    def update_hover(self, pos):
        self.is_hovered = self.rect.collidepoint(pos)

class QuizGame:
    def __init__(self):
        self.questions = random.sample(QUIZ_QUESTIONS, len(QUIZ_QUESTIONS))
        self.current_question = 0
        self.score = 0
        self.state = "start"  # start, quiz, result, end
        self.selected_answer = None
        self.answer_buttons = []
        self.create_answer_buttons()
    
    def create_answer_buttons(self):
        self.answer_buttons = []
        question = self.questions[self.current_question]
        button_width = 700
        button_height = 60
        start_y = 350
        spacing = 90
        
        for i, option in enumerate(question["options"]):
            x = (SCREEN_WIDTH - button_width) // 2
            y = start_y + (i * spacing)
            btn = Button(x, y, button_width, button_height, option, LIGHT_BLUE, BLACK)
            self.answer_buttons.append(btn)
    
    def draw_start_screen(self):
        screen.fill(WHITE)
        
        title = font_large.render("📚 Finnegan's History Quiz", True, BLUE)
        title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 100))
        screen.blit(title, title_rect)
        
        subtitle = font_medium.render("Test your knowledge of English & Medieval History!", True, BLACK)
        subtitle_rect = subtitle.get_rect(center=(SCREEN_WIDTH // 2, 180))
        screen.blit(subtitle, subtitle_rect)
        
        info1 = font_small.render(f"Total Questions: {len(self.questions)}", True, GRAY)
        info1_rect = info1.get_rect(center=(SCREEN_WIDTH // 2, 280))
        screen.blit(info1, info1_rect)
        
        info2 = font_small.render("Topics: Wessex, Medieval England, Modern History", True, GRAY)
        info2_rect = info2.get_rect(center=(SCREEN_WIDTH // 2, 320))
        screen.blit(info2, info2_rect)
        
        start_btn = Button(250, 450, 400, 80, "Start Quiz", BLUE, WHITE)
        start_btn.draw(screen)
        
        return start_btn
    
    def draw_quiz_screen(self):
        screen.fill(WHITE)
        
        # Progress
        progress_text = font_small.render(f"Question {self.current_question + 1} / {len(self.questions)}", True, GRAY)
        progress_rect = progress_text.get_rect(topleft=(20, 20))
        screen.blit(progress_text, progress_rect)
        
        # Progress bar
        bar_width = SCREEN_WIDTH - 40
        bar_height = 10
        bar_rect = pygame.Rect(20, 50, bar_width, bar_height)
        pygame.draw.rect(screen, GRAY, bar_rect)
        
        progress_amount = (self.current_question / len(self.questions)) * bar_width
        pygame.draw.rect(screen, BLUE, (20, 50, progress_amount, bar_height))
        
        # Question
        question = self.questions[self.current_question]
        question_text = font_medium.render(question["question"], True, BLACK)
        question_rect = question_text.get_rect(center=(SCREEN_WIDTH // 2, 130))
        screen.blit(question_text, question_rect)
        
        # Category badge
        category_text = font_small.render(f"Category: {question['category']}", True, BLUE)
        category_rect = category_text.get_rect(center=(SCREEN_WIDTH // 2, 190))
        screen.blit(category_text, category_rect)
        
        # Answer buttons
        for i, btn in enumerate(self.answer_buttons):
            if self.selected_answer is not None:
                if i == question["correct"]:
                    btn.color = GREEN
                elif i == self.selected_answer and self.selected_answer != question["correct"]:
                    btn.color = RED
                else:
                    btn.color = LIGHT_BLUE
            btn.draw(screen)
        
        # Next button (appears after answer selected)
        if self.selected_answer is not None:
            next_btn = Button(350, 620, 200, 50, "Next", BLUE, WHITE)
            next_btn.draw(screen)
            return next_btn
        
        return None
    
    def draw_result_screen(self):
        screen.fill(WHITE)
        
        percentage = (self.score / len(self.questions)) * 100
        
        title = font_large.render("Quiz Complete! 🎉", True, BLUE)
        title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 100))
        screen.blit(title, title_rect)
        
        score_text = font_large.render(f"Score: {self.score} / {len(self.questions)}", True, GREEN)
        score_rect = score_text.get_rect(center=(SCREEN_WIDTH // 2, 220))
        screen.blit(score_text, score_rect)
        
        percentage_text = font_medium.render(f"Percentage: {percentage:.1f}%", True, BLUE)
        percentage_rect = percentage_text.get_rect(center=(SCREEN_WIDTH // 2, 300))
        screen.blit(percentage_text, percentage_rect)
        
        # Rating message
        if percentage == 100:
            message = "Perfect Score! 🏆 You're a history expert!"
            color = GREEN
        elif percentage >= 80:
            message = "Excellent! 👏 Great knowledge of history!"
            color = GREEN
        elif percentage >= 60:
            message = "Good! 👍 You know your stuff!"
            color = BLUE
        else:
            message = "Keep learning! 📚 History is fascinating!"
            color = BLUE
        
        message_text = font_small.render(message, True, color)
        message_rect = message_text.get_rect(center=(SCREEN_WIDTH // 2, 380))
        screen.blit(message_text, message_rect)
        
        restart_btn = Button(250, 500, 400, 80, "Retake Quiz", BLUE, WHITE)
        restart_btn.draw(screen)
        
        return restart_btn
    
    def handle_answer_click(self, pos):
        question = self.questions[self.current_question]
        for i, btn in enumerate(self.answer_buttons):
            if btn.is_clicked(pos):
                self.selected_answer = i
                if i == question["correct"]:
                    self.score += 1
    
    def next_question(self):
        if self.current_question < len(self.questions) - 1:
            self.current_question += 1
            self.selected_answer = None
            self.create_answer_buttons()
            self.state = "quiz"
        else:
            self.state = "result"
    
    def restart_quiz(self):
        self.__init__()

# Main game loop
def main():
    game = QuizGame()
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = event.pos
                
                if game.state == "start":
                    start_btn = game.draw_start_screen()
                    if start_btn.is_clicked(pos):
                        game.state = "quiz"
                
                elif game.state == "quiz":
                    game.handle_answer_click(pos)
                    next_btn = game.draw_quiz_screen()
                    if game.selected_answer is not None and next_btn and next_btn.is_clicked(pos):
                        game.next_question()
                
                elif game.state == "result":
                    restart_btn = game.draw_result_screen()
                    if restart_btn.is_clicked(pos):
                        game.restart_quiz()
            
            if event.type == pygame.MOUSEMOTION:
                pos = event.pos
                if game.state == "quiz":
                    for btn in game.answer_buttons:
                        btn.update_hover(pos)
        
        # Draw current screen
        if game.state == "start":
            game.draw_start_screen()
        elif game.state == "quiz":
            game.draw_quiz_screen()
        elif game.state == "result":
            game.draw_result_screen()
        
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
