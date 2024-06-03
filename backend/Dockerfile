FROM python:3.9-slim-buster as requirements-stage

# Install poetry and export project dependencies to a requirements.txt file
RUN pip install poetry
COPY ./pyproject.toml ./poetry.lock /
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes --without=dev

FROM python:3.9-slim-buster

# Copy the requirements.txt we generated in the first stage
COPY --from=requirements-stage /requirements.txt /requirements.txt

# Copy the project files into the docker image
COPY ./pyproject.toml ./app/core/gunicorn_conf.py /
COPY ./app /app

# Install python dependencies
RUN python3 -m pip install --no-cache-dir --upgrade -r requirements.txt

# Download nltk stopwords
RUN python3 -c "\
import nltk;\
nltk.download('wordnet');\
nltk.download('omw-1.4');\
nltk.download('averaged_perceptron_tagger');\
nltk.download('universal_tagset');\
nltk.download('stopwords');\
nltk.download('punkt');\
"
# Create directories for shared memory and local files
RUN mkdir -p /tmp/shm && mkdir /.local

# Set the environment variable for the port
ENV PORT 8000
EXPOSE 8000

# The command to run when the docker container starts
ENTRYPOINT ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]