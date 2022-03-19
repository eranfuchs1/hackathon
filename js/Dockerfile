FROM archlinux:latest

RUN pacman -Syu --noconfirm nodejs npm
COPY . .

CMD ["node", "app.js"]
