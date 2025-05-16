# Export

The platform template contains some scripts to facilitate exporting artifacts from an existing space, and saving to a local directory. These artifacts can then be programmatically installed when provisioning a new space.

The export functionality is found in the `template/tooling` directory, and the exported artifacts can be found in the `template/export` directory.

## Pre-requisites

Exporting requires space admin privileges, therefore a space admin user must be used in the configuration when running this operation. The integrator service does not support basic authentication like the core service does, it requires the use of a bearer token for authentication. Therefore, an OAuth client must be created, or must already exist in the space. OAuth clients can be found in the space console under the `Space -> Configuration Settings -> OAuth` tab.

- [Ruby](https://www.ruby-lang.org/en/) must be installed on the local workstation running the export script
- The bundler gem is installed

  ```
  gem install bundler
  ```

- The gems listed in `template/tooling/Gemfile` are installed

  ```
  cd template/tooling
  bundle install
  ```

- Space to export from has a User with space admin permissions with known credentials
- Space to export from has an OAuth client with known credentials
- [Direnv](https://direnv.net/) is installed on the local workstation running export - **NOT a requirement, just nice to have**

## Configuration

The configuration options are collected from environment variables. The values to be used can either be specified directly on the command line when running the operation, manually exported on the command line before running the operation, or by using `direnv` with a `.envrc` file.

### Environment variables with Direnv

Benefits of using [Direnv](https://direnv.net/) are explained on the website. In summary, the values are set in an `.envrc` file so the values cannot be seen in the terminal history, and these values are only available to the terminal session when changed into the tooling directory.

**Example** - using `direnv` with an `.envrc` file

```
# template/tooling/.envrc
export EXPORT_DOMAIN=mydomain.io
export EXPORT_SPACE_SLUG=my-space
export EXPORT_SPACE_ADMIN_USERNAME=space-integration-user
export EXPORT_SPACE_ADMIN_PASSWORD="bad-password"
```

```
cd template/tooling
ruby export_driver.rb
```

### Environment variables while running the operation

If you don't want to, or can't install Direnv, you can still apply environment variables to the export driver. One way is to define the environment variables directly in the terminal on the same line as the ruby command to run the export driver script.

A benefit of specifying the environment variables while running the command is that the values are not available in the terminal session after the command completes. The downside to using this approach is the values can be seen in the terminal history.

**Example** - specifying environment variables while running the operation

```
cd template/tooling

EXPORT_DOMAIN=mydomain.io \
EXPORT_SPACE_SLUG=my-space \
EXPORT_SPACE_ADMIN_USERNAME=space-integration-user \
EXPORT_SPACE_ADMIN_PASSWORD="bad-password" \
ruby export_driver.rb
```

### Environment variables set before running the operation

Another to accomplish setting the environment variables without Direnv is to simply use the `export` builtin to set each environment variable. This might be slightly easier to use as each variable will be set independently on its own line instead of all of them at once. Makes it easier to spot typos if an incorrect value is provided.

A benefit of setting the environment variables before running the command is that the values only need to be set once per terminal session if you need to run the operation multiple times. The downsides to using this approach are the values are availble to every other command / process that is run from the same terminal session, and these export statemens can also be seen in the terminal history.

**Example** - exporting environment variables before running the operation

```
cd template/tooling

export EXPORT_DOMAIN=mydomain.io
export EXPORT_SPACE_SLUG=my-space
export EXPORT_SPACE_ADMIN_USERNAME=space-integration-user
export EXPORT_SPACE_ADMIN_PASSWORD="bad-password"
ruby export_driver.rb
```

## Export

It is common to develop in a template space, then export those artifacts so they can be installed in new spaces. The export script will export all necessary artifacts from an existing space.

The tooling directory contains a main `export.rb` file that is responsible for doing the work, and an `export_driver.rb` file that is responsible for collecting the necessary configuration data and building up the options string that is passed to `export.rb`. A user should not have to interact directly with the `export.rb` file.

In order to export a space you will need to set the following environment variables:

- _EXPORT_SPACE_SLUG_ - the part of the URL after `http://` or `https://`, and before the next dot `.`.
- _EXPORT_DOMAIN_ - this is the part of the URL after the space slug, and before the next forward slash `/`.
- _EXPORT_SPACE_ADMIN_USERNAME_ - the username of a User account with space admin privileges
- _EXPORT_SPACE_ADMIN_PASSWORD_ - the password for the space admin user

### OAuth Client

If using one of the built-in service accounts for the space user, then you shouldn't need any other information. A built-in service account username is either `integration-user` or `space-integration-user`, and a built-in OAuth client should already exist for these accounts.

If using a different user account, then you will also need to ensure an OAuth client has been created and set the additional environment variables:

- _EXPORT_OAUTH_CLIENT_ID_ - The OAuth client id
- _EXPORT_OAUTH_CLIENT_SECRET_ - The OAuth client secret

Note that the OAuth Client ID does not need to match the Username of the space admin user. The pattern matching rules for the OAuth Client ID property only allow alphanumeric and hyphen characters, so if the space admin username contains an email address for instance, then the OAuth Client ID cannot match. The mismatch does not make a difference in this case, just create the OAuth client with any value that meets the pattern requirements, and then set the value for the `EXPORT_OAUTH_CLIENT_ID` environment variable.

### Running the Export

Once the configuration values have been identified, the environment variables need to be set using one of the three methods described in the Configuration section.

Then the export driver script can be invoked with the Ruby runtime interpreter.

```
ruby export_driver.rb
```

The exported artifacts can be found in the `template/export` directory. Any changes must be committed and pushed to Github before they are available to new spaces.
