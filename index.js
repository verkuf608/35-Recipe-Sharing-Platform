const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123' },
  // 添加更多用户数据...
];

// 模拟食谱和评论数据存储
let recipes = [
  { id: 1, title: 'Pasta Carbonara', ingredients: ['pasta', 'eggs', 'bacon'], authorId: 1, comments: [] },
  // 添加更多食谱数据...
];

// 用户认证中间件
function authenticateUser(req, res, next) {
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = users.find((u) => u.id === parseInt(userId));

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  next();
}

// 处理获取所有食谱的请求
app.get('/recipes', (req, res) => {
  res.json({ recipes });
});

// 处理获取单个食谱的请求
app.get('/recipe/:recipeId', (req, res) => {
  const recipeId = parseInt(req.params.recipeId);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe) {
    res.json({ recipe });
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// 处理添加评论到食谱的请求
app.post('/recipe/:recipeId/comment', authenticateUser, (req, res) => {
  const recipeId = parseInt(req.params.recipeId);
  const { comment } = req.body;
  const user = req.user;

  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe) {
    const newComment = { user: user.username, text: comment };
    recipe.comments.push(newComment);
    res.json({ message: 'Comment added successfully', comment: newComment });
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
