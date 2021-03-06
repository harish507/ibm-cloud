#!/bin/sh
#change these four parameters as needed for your own environment
AKS_PERS_STORAGE_ACCOUNT_NAME=mintsstorage
AKS_PERS_RESOURCE_GROUP=elk
AKS_PERS_LOCATION=centralus
AKS_PERS_SHARE_NAME=routes

# Create a resource group
#az group create --name $AKS_PERS_RESOURCE_GROUP --location $AKS_PERS_LOCATION

# Create a storage account
#az storage account create -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -l $AKS_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable, this is used when creating the Azure file share
export AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -o tsv)

# Create the file share
az storage share create -n $AKS_PERS_SHARE_NAME --connection-string $AZURE_STORAGE_CONNECTION_STRING

# Get storage account key
STORAGE_KEY=$(az storage account keys list --resource-group $AKS_PERS_RESOURCE_GROUP --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

#Creating azure secret
kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=$AKS_PERS_STORAGE_ACCOUNT_NAME --from-literal=azurestorageaccountkey=$STORAGE_KEY

#Creating directories in fileshare
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name maps --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name logs --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name catalog --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global --output none

az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test/source --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test/target --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test/input --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test/output --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name Global/Test/success --output none

az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name testCases --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name testTemplates --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name properties --output none

az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name xslt --output none
az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name xslt/maps --output none

az storage directory create --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --name .camel --output none

#Uploading files to maps directory
az storage file upload --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --source "Upper_Map.mmc" --path "maps/Upper_Map.mmc"
az storage file upload --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --source "XmlToJson.xslt" --path "xslt/maps/XmlToJson.xslt"
az storage file upload --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --account-key $STORAGE_KEY --share-name $AKS_PERS_SHARE_NAME --source "Properties.properties" --path ".camel/Properties.properties"
# Echo storage account name and key
echo Storage account name: $AKS_PERS_STORAGE_ACCOUNT_NAME
echo Storage account key: $STORAGE_KEY
