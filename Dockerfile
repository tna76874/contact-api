FROM ghcr.io/tna76874/contact-apibase:1b14ea49bcad4858943519298e2ad11defa98963

COPY server /app
RUN chmod -R +x /app

EXPOSE 5000

COPY server/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["sh", "-c", "/app/entrypoint.sh"]
