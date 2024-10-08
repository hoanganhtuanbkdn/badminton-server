eval `ssh-agent -s`
ssh-add ../tuan-key
git pull origin
docker-compose up --build -d
