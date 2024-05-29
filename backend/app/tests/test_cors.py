import httpx
import pytest

# The app need to be running in order to run this test
@pytest.mark.asyncio
async def test_cors_headers():
    url = "http://127.0.0.1:8000/"  
    headers = {
        "Origin": "http://localhost:5173",  
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"