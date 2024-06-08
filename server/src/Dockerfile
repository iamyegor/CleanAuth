# Build Image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore

WORKDIR /src/Api
RUN dotnet publish -c Release -o /app/publish

# Production image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app 

COPY --from=build /app/publish .

EXPOSE 7071

ENTRYPOINT ["dotnet", "Api.dll"]
