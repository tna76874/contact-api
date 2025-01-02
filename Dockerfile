FROM ghcr.io/tna76874/contact-apibase:1b14ea49bcad4858943519298e2ad11defa98963

COPY server /app
RUN chmod -R +x /app

EXPOSE 5000

COPY server/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

HEALTHCHECK --interval=10m --timeout=1m --start-period=20s \
   CMD curl -f --retry 3 --max-time 5 --retry-delay 10 --retry-max-time 60 "http://localhost:5000/api/health" || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'

CMD ["sh", "-c", "/app/entrypoint.sh"]
