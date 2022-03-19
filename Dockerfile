FROM archlinux:latest

RUN pacman -Syu --noconfirm php nodejs npm

COPY . .

CMD ["php", "-S", "0.0.0.0:8080"]
